package com.myenglishcoach.shared.ai;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class GroqClient {
    private final RestClient client;
    private final String apiKey;
    private final String model;

    public GroqClient(RestClient.Builder builder,
                      @Value("${app.groq.base-url}") String baseUrl,
                      @Value("${app.groq.api-key}") String apiKey,
                      @Value("${app.groq.model}") String model) {
        this.client = builder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.model = model;
    }

    public String complete(List<Map<String, String>> messages) {
        if (apiKey.isBlank()) throw new IllegalStateException("GROQ_API_KEY is not configured on the server.");
        JsonNode response = client.post().uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("model", model, "messages", messages, "temperature", 0.25, "stream", false,
                        "response_format", Map.of("type", "json_object")))
                .retrieve().body(JsonNode.class);
        JsonNode content = response.path("choices").path(0).path("message").path("content");
        if (content.isMissingNode() || content.asText().isBlank()) throw new IllegalStateException("Groq returned no assistant message.");
        return content.asText();
    }
}
