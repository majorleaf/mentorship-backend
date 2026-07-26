import ai from "../config/ai.js";
import User from "../models/User.js";

export const chatWithMentor = async (req, res) => {
    try { 
        const { message, history } = req.body;
        const userId = req.user._id;

        if (!message) {
            return res.status(400).json({ message: "Message is required "});
        }

        const user = await User.findById(userId).populate("organizationId", "name");

        if(!user) {
            return res.status(404).json({ message: "User not found"});
        }

        // AI context to act as an internal corporate mentor
        let systemInstruction = `You are an expert AI Career Mentor and Strategist for an enterprise platform. 
Your goal is to help employees navigate their career growth, identify skill gaps, and prepare for internal mobility.
You are talking to a user named ${user.name}.
Their role on the platform is: ${user.role}.`;
        if (user.accountType === "b2b" && user.organizationId ) {
            systemInstruction += `\n They work at an organization named ${user.organizationId.name}. You should focus your advice on internal corporate growth within this specific company. `;

        }

        if (user.profile && user.profile.skills && user.profile.skills.length > 0) {
            systemInstruction += `\n Their current skills include: ${user.profile.skills.join("," )}.`;
        }

        if (user.profile && user.profile.goals && user.profile.goals.length > 0) {
            systemInstruction += `\n Their career goals are: ${user.porfile.goals.join(", ")}.`;

        }

        // This allows streaming of the AI response back to the client word by word 
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        
        
        // // The new SDK uses 'contents' format: [{ role: 'user' | 'model', parts: [{ text: '...' }] }]
        const formattedHistory = (history || []).map( msg => ({
            role: msg.role === "ai" ? "model" : "user",
            parts: [{ text: msg.text }]
        }));

        const contexts = [
            ...formattedHistory,
            { role: "user", parts: [{ text: message }] }
        ];

        //robuust model for reasoning and chat 
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-pro",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7, //Balanced creativity and focused advice
            }
        });


        for await (const chunk of responseStream) {
            if (chunk.text) {
                // format it as SSE data
                res.write(`data: ${ JSON.stringify({ text: chunk.text })}\n\n`);
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();


    } catch (error) {
        console.error( "AI chat error:", error );
        // If headers are already sent (mid-stream), we just end it. Otherwise, send standard 500.
        if (!res.headersSent) {
            return res.status(500).json({ message: " Error communcating with AI Mentor" });
        } else {
            res.write(`data: ${JSON.stringify({ error: "Stream interrupted due to an error."})}\n\n`);
            res.end();
        }
    }

};