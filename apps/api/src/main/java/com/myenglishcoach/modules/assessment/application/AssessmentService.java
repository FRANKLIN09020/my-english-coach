package com.myenglishcoach.modules.assessment.application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myenglishcoach.modules.assessment.domain.AssessmentResult;
import com.myenglishcoach.modules.assessment.domain.AssessmentSession;
import com.myenglishcoach.shared.ai.GroqClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AssessmentService {
    private static final int MAX_TURNS = 8;
    private final Map<UUID, AssessmentSession> sessions = new ConcurrentHashMap<>();
    private final GroqClient groqClient;
    private final ObjectMapper json;

    public AssessmentService(GroqClient groqClient, ObjectMapper json) { this.groqClient = groqClient; this.json = json; }

    public AssessmentSession start(String name) {
        AssessmentSession session = new AssessmentSession(name.trim());
        session.addTurn("assistant", "Hi " + session.learnerName() + "! I’m your English coach. Let’s have a relaxed conversation. Could you introduce yourself and tell me what you enjoy doing?");
        sessions.put(session.id(), session);
        return session;
    }

    public CoachReply answer(UUID sessionId, String answer) {
        AssessmentSession session = Optional.ofNullable(sessions.get(sessionId))
                .orElseThrow(() -> new NoSuchElementException("Assessment session not found."));
        if (session.result() != null) return new CoachReply("Your assessment is already complete.", true, session.result());
        session.addTurn("user", answer.trim());
        String raw = groqClient.complete(messagesFor(session));
        return applyCoachResponse(session, raw);
    }

    private List<Map<String, String>> messagesFor(AssessmentSession session) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt(session.learnerName(), session.turns().size())));
        for (AssessmentSession.Turn turn : session.turns()) messages.add(Map.of("role", turn.role(), "content", turn.content()));
        return messages;
    }

    private CoachReply applyCoachResponse(AssessmentSession session, String raw) {
        try {
            JsonNode node = json.readTree(extractJsonObject(raw));
            String message = node.path("message").asText("Thanks for sharing. Could you tell me a little more?");
            boolean complete = node.path("complete").asBoolean(false) || session.turns().size() >= MAX_TURNS * 2;
            session.addTurn("assistant", message);
            if (!complete) return new CoachReply(message, false, null);
            AssessmentResult result = new AssessmentResult(
                    node.path("result").path("cefrLevel").asText("B1"),
                    node.path("result").path("confidence").asInt(60),
                    node.path("result").path("summary").asText("You can communicate in familiar situations."),
                    new AssessmentResult.DimensionScores(node.path("result").path("scores").path("grammar").asInt(50), node.path("result").path("scores").path("vocabulary").asInt(50), node.path("result").path("scores").path("fluency").asInt(50), node.path("result").path("scores").path("comprehension").asInt(50)),
                    node.path("result").path("studyPlan").asText("Practise English for 15 minutes every day."));
            session.complete(result);
            return new CoachReply(message, true, result);
        } catch (Exception ignored) {
            String fallback = fallbackQuestion(session);
            session.addTurn("assistant", fallback);
            return new CoachReply(fallback, false, null);
        }
    }

    private String systemPrompt(String name, int messageCount) {
        return "You are a warm, expert CEFR English assessor coaching " + name + ". Assess naturally through one friendly conversation question at a time. Sample grammar, vocabulary, sentence control, detail, and comprehension. Adapt difficulty based on the learner's last answer. Do not reveal scores or correct every error while assessing. End after 5-8 learner answers, or sooner only if evidence is sufficient. Return ONLY valid JSON, no markdown: {\\\"message\\\":string,\\\"complete\\\":boolean,\\\"result\\\":null|{\\\"cefrLevel\\\":\\\"A1|A2|B1|B2|C1|C2\\\",\\\"confidence\\\":0-100,\\\"summary\\\":string,\\\"scores\\\":{\\\"grammar\\\":0-100,\\\"vocabulary\\\":0-100,\\\"fluency\\\":0-100,\\\"comprehension\\\":0-100},\\\"studyPlan\\\":string}}. This is assessment turn " + ((messageCount + 1) / 2) + ".";
    }

    private String stripCodeFence(String value) { return value.replaceAll("^```(?:json)?\\s*|\\s*```$", "").trim(); }
    private String extractJsonObject(String value) {
        String cleaned = stripCodeFence(value);
        int start = cleaned.indexOf('{');
        int end = cleaned.lastIndexOf('}');
        return start >= 0 && end >= start ? cleaned.substring(start, end + 1) : cleaned;
    }
    private String fallbackQuestion(AssessmentSession session) {
        long answers = session.turns().stream().filter(turn -> turn.role().equals("user")).count();
        return switch ((int) (answers % 3)) {
            case 1 -> "No problem. Let’s try a different topic: what do you usually do on a normal weekday?";
            case 2 -> "That’s okay. Could you tell me about a film, video, or book you enjoyed recently?";
            default -> "Let’s talk about your goals. What would you like to improve in your English, and why?";
        };
    }
    public record CoachReply(String message, boolean complete, AssessmentResult result) {}
}
