package com.myenglishcoach.modules.assessment.api;

import com.myenglishcoach.modules.assessment.application.AssessmentService;
import com.myenglishcoach.modules.assessment.domain.AssessmentResult;
import com.myenglishcoach.modules.assessment.domain.AssessmentSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assessments")
public class AssessmentController {
    private final AssessmentService assessments;
    public AssessmentController(AssessmentService assessments) { this.assessments = assessments; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StartResponse start(@Valid @RequestBody StartRequest request) {
        AssessmentSession session = assessments.start(request.name());
        return new StartResponse(session.id(), session.turns().getFirst().content());
    }

    @PostMapping("/{sessionId}/answers")
    public AnswerResponse answer(@PathVariable UUID sessionId, @Valid @RequestBody AnswerRequest request) {
        AssessmentService.CoachReply reply = assessments.answer(sessionId, request.answer());
        return new AnswerResponse(reply.message(), reply.complete(), reply.result());
    }

    public record StartRequest(@NotBlank @Size(max = 80) String name) {}
    public record AnswerRequest(@NotBlank @Size(max = 4000) String answer) {}
    public record StartResponse(UUID sessionId, String message) {}
    public record AnswerResponse(String message, boolean complete, AssessmentResult result) {}
}
