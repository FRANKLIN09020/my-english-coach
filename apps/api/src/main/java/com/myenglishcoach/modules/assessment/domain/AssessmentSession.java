package com.myenglishcoach.modules.assessment.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AssessmentSession {
    private final UUID id = UUID.randomUUID();
    private final String learnerName;
    private final List<Turn> turns = new ArrayList<>();
    private AssessmentResult result;

    public AssessmentSession(String learnerName) { this.learnerName = learnerName; }
    public UUID id() { return id; }
    public String learnerName() { return learnerName; }
    public List<Turn> turns() { return List.copyOf(turns); }
    public AssessmentResult result() { return result; }
    public void addTurn(String role, String content) { turns.add(new Turn(role, content)); }
    public void complete(AssessmentResult value) { result = value; }
    public record Turn(String role, String content) {}
}
