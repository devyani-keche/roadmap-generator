// import Groq from "groq-sdk";
// import "dotenv/config";
// import express from "express";
// import cors from "cors";

// const port=5000;
// const app=express();
// app.use(cors());
// app.use(express.json());
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// async function cleanAIResponse(content) {
//   if (!content) return "";
//   const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
//   if (match && match[1]) {
//     return match[1].trim();
//   }
//  const arrayMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]/);
//   if (arrayMatch && arrayMatch[0]) {
//     return arrayMatch[1].trim();
//   }

//   throw new Error("No valid JSON block found in response");
// }

// app.post("/api/generate-roadmap", async (req, res)=> {
//   try{
//         const chatCompletion = await groq.chat.completions.create({
//             messages: 
//             [
//                 {
//                 role: "user",
//                 content: `You are an expert professional roadmap architect with 15+ years of experience in tech project planning, stakeholder alignment, and Agile execution.
//                 Your job is to generate the roadmap for: ${req.body.topic}.
//                 And, format as JSON array, Here is the sample structure {title:"XYZ",description:"Lorem Ipsem....",id:"1",estimated_time:"14 hours / 2days/weeks/months/years"}.
//                 Important Note: Kindly adhere to the JSON structure provided to you as sample structure.`,
//                 },
//             ],
//             model: "openai/gpt-oss-20b",
//         });

//         let aiContent = chatCompletion.choices[0]?.message?.content ;
//         console.log("RAW:::::",aiContent);
//         const cleanedContent = await cleanAIResponse(aiContent);

//     let roadmap;
//     try {
//       roadmap = await JSON.parse(cleanedContent);
//       console.log("JSON:::", roadmap);
//     } catch (jsonErr) {
//       console.error("Failed to parse AI response as JSON:", jsonErr.message);
//       return res.status(500).json({
//         error: "AI response was not valid JSON.",
//         message: jsonErr.message,
//       });
//     }
//     res.json(roadmap);
//   } 

//     catch(error){
//         console.error("Error generating roadmap:", error);
//         res.status(500).json({ error: "Failed to generate roadmap" });
//     }

// });
// app.listen(port, "localhost",()=> {
//     console.log(`Server is running at http://localhost:${port}`);
// });
import Groq from "groq-sdk";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // from Vercel env
});

async function cleanAIResponse(content) {
  if (!content) return "";

  const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match && match[1]) {
    return match[1].trim();
  }

  const arrayMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]/);
  if (arrayMatch && arrayMatch[0]) {
    return arrayMatch[0].trim();
  }

  throw new Error("No valid JSON block found in response");
}

app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `You are an expert professional roadmap architect with 15+ years of experience in tech project planning, stakeholder alignment, and Agile execution.
Your job is to generate the roadmap for: ${req.body.topic}.
Format the output strictly as a JSON array.
Sample structure:
{ "title": "XYZ", "description": "Lorem Ipsum", "id": "1", "estimated_time": "14 hours / 2 days / weeks / months" }`,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    const aiContent = chatCompletion.choices[0]?.message?.content;
    const cleanedContent = await cleanAIResponse(aiContent);

    const roadmap = JSON.parse(cleanedContent);
    res.json(roadmap);

  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

// 🚨 IMPORTANT: export app (NO app.listen)
export default app;
