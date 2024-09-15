package com.note_taker.web.enums;

public enum Priority {
    LOW(1),
    MEDIUM(2),
    HIGH(3),
    VERY_HIGH(4),
    CRITICAL(5);

    private final int priorityValue;

    Priority(int priorityValue) {
        this.priorityValue = priorityValue;
    }

    public int getPriorityValue() {
        return priorityValue;
    }
}
