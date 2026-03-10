const User = require("../models/User");
const Clinic = require("../models/Clinic");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// @desc    Register a new clinic and primary doctor using Google
// @route   POST /api/auth/register
// @access  Public
const registerClinic = async (req, res) => {
  try {
    const { clinicName, clinicAddress, doctorPhone, doctorLicense, credential, profileImage } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, error: "No Google credential provided." });
    }

    if (!clinicName) {
      return res.status(400).json({ success: false, error: "Clinic name is required." });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = payload.name;
    const picture = profileImage || payload.picture;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, error: "Doctor already registered with this email" });
    }

    // Create Clinic
    const clinic = await Clinic.create({
      name: clinicName,
      address: clinicAddress || "",
    });

    // Create Doctor (User)
    const doctor = await User.create({
      name,
      email,
      googleId,
      profileImage: picture,
      phone: doctorPhone || "",
      licenseNumber: doctorLicense || "",
      role: "primary",
      clinic: clinic._id,
    });

    // Link doctor to clinic
    clinic.primaryDoctor = doctor._id;
    await clinic.save();

    res.status(201).json({
      success: true,
      data: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        profileImage: doctor.profileImage,
        clinic: clinic,
        token: generateToken(doctor._id),
      },
    });
  } catch (error) {
    console.error("Clinic Registration Error:", error);
    res.status(500).json({ success: false, error: "Server Error during registration" });
  }
};

// @desc    Auth user & get token (Login) with Google
// @route   POST /api/auth/login
// @access  Public
const loginDoctor = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, error: "No Google credential provided." });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    // Find the doctor
    const doctor = await User.findOne({ email }).populate("clinic");

    if (doctor) {
      // Update Google ID if logging in with Google for the first time
      if (!doctor.googleId) {
        doctor.googleId = payload.sub;
        await doctor.save();
      }

      res.status(200).json({
        success: true,
        data: {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          profileImage: doctor.profileImage,
          role: doctor.role,
          clinic: doctor.clinic,
          token: generateToken(doctor._id),
        },
      });
    } else {
      res.status(401).json({ success: false, error: "Doctor not found. Please register your clinic first." });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Server Error during login" });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id).select("-password").populate("clinic");
    
    if (!doctor) {
      return res.status(404).json({ success: false, error: "Doctor not found." });
    }
    
    res.status(200).json({
      success: true,
      data: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        profileImage: doctor.profileImage,
        role: doctor.role,
        clinic: doctor.clinic,
      },
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Invite a new doctor to the clinic
// @route   POST /api/auth/invite
// @access  Private (Primary Doctor only)
const inviteDoctor = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }

    if (req.user.role !== "primary") {
      return res.status(403).json({ success: false, error: "Only primary doctors can invite others." });
    }

    // Generate an invite token valid for 7 days
    const inviteToken = jwt.sign(
      { clinicId: req.user.clinic, email: email.toLowerCase() },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    const inviteUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth?inviteToken=${inviteToken}`;
    
    // Fetch clinic info for the email template
    const clinic = await Clinic.findById(req.user.clinic);

    console.log(clinic);
    console.log(email);
    console.log(inviteUrl);
    console.log(req.user.name);
    // Send email via Nodemailer
    const mailOptions = {
      from: `"Carewell Clinic" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invitation to join ${clinic?.name || "Carewell Clinic"}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563EB;">You've been invited!</h2>
          <p>Dr. ${req.user.name} has invited you to join <strong>${clinic?.name || "the clinic"}</strong> on Carewell AI.</p>
          <p>Click the link below to accept the invitation and sign in securely with your Google account:</p>
          <a href="${inviteUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563EB; color: #fff; text-decoration: none; border-radius: 8px; margin-top: 10px; font-weight: bold;">Accept Invitation</a>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">If you did not expect this, please ignore it.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Nodemailer Error Details:", error);
      return res.status(500).json({ success: false, error: "Failed to send invitation email using Nodemailer." });
    }

    res.status(200).json({ success: true, message: "Invitation sent successfully." });
  } catch (error) {
    console.error("Invite Doctor Error:", error);
    res.status(500).json({ success: false, error: "Server Error during invitation" });
  }
};

// @desc    Accept an invite and register/login as a secondary doctor
// @route   POST /api/auth/accept-invite
// @access  Public
const acceptInvite = async (req, res) => {
  try {
    const { credential, inviteToken, doctorPhone, doctorLicense } = req.body;

    if (!credential || !inviteToken) {
      return res.status(400).json({ success: false, error: "Missing credential or invite token." });
    }

    // Verify Invite Token
    let decodedInvite;
    try {
      decodedInvite = jwt.verify(inviteToken, process.env.JWT_SECRET || "fallback_secret");
    } catch (err) {
      return res.status(400).json({ success: false, error: "Invalid or expired invite token." });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleEmail = payload.email.toLowerCase();

    if (googleEmail !== decodedInvite.email) {
      return res.status(400).json({ success: false, error: "Google email does not match the invited email." });
    }

    // Check if user already exists
    let doctor = await User.findOne({ email: googleEmail });

    if (doctor) {
       // If doctor exists, verify they belong to this clinic
       if (doctor.clinic.toString() !== decodedInvite.clinicId) {
          return res.status(400).json({ success: false, error: "User exists but belongs to a different clinic." });
       }
       
       // Update Google ID if necessary
       if (!doctor.googleId) {
          doctor.googleId = payload.sub;
          await doctor.save();
       }
    } else {
       // Register new doctor directly into the clinic
       doctor = await User.create({
         name: payload.name,
         email: googleEmail,
         googleId: payload.sub,
         profileImage: payload.picture,
         phone: doctorPhone || "",
         licenseNumber: doctorLicense || "",
         role: "doctor",
         clinic: decodedInvite.clinicId,
       });
    }

    const populatedDoctor = await User.findById(doctor._id).populate("clinic");

    res.status(200).json({
      success: true,
      data: {
        _id: populatedDoctor._id,
        name: populatedDoctor.name,
        email: populatedDoctor.email,
        profileImage: populatedDoctor.profileImage,
        clinic: populatedDoctor.clinic,
        token: generateToken(populatedDoctor._id),
      },
    });
  } catch (error) {
    console.error("Accept Invite Error:", error);
    res.status(500).json({ success: false, error: "Server Error during invite acceptance" });
  }
};

// @desc    Get all doctors belonging to the current user's clinic
// @route   GET /api/auth/clinic-doctors
// @access  Private
const getClinicDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ clinic: req.user.clinic })
      .select("-password")
      .sort({ role: -1, createdAt: 1 }); // Primary first, then by creation date

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Get Clinic Doctors Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  registerClinic,
  loginDoctor,
  getMe,
  inviteDoctor,
  acceptInvite,
  getClinicDoctors,
};
