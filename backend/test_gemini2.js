require("dotenv").config();
const { generateConsultationNotes } = require("./src/services/aiService");

async function run() {
  try {
    const res = await generateConsultationNotes({
      symptoms: "Severe throbbing headache on right side, starting from occiput.",
      modalities: "Worse from light, noise. Better from wrapping head warmly.",
      generals: "Thirsty for small quantities of cold water. Feeling chilly.",
      mentals: "Highly irritable, wants to be left alone, easily disturbed.",
      diagnosis: "Migraine",
      prescription: "Silicea 30c",
      additionalNotes: ""
    });
    console.log("SUCCESS:", res);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
run();
