export enum LessonDataKeys {
    ID = 'id',
    TOPIC_ID = 'topicId',
    TOPIC = 'topic',
    INSTRUCTION = 'instruction',
    INSTRUCTION_FILE = 'instructionFile',
    ASSESSMENT_QUESTION = 'assessmentQuestion',
    ANSWER_CHOICES = 'answerChoices',
    ASSESSMENT_ANSWER_TYPE = 'assessmentAnswerType',
    SIMPLE_ANSWER = 'simpleAnswer',
    CREATED_BY_USER_ID = 'createdByUserId',
    ASSESSMENT = 'assessment',
}
export enum AnswerChoiceDataKeys {
    IS_CORRECT = 'isCorrect',
    ANSWER_CHOICE = 'answerChoice',
}
export interface LessonData {
    id?: string;
    topicId?: string;
    instruction: string | InstructionData;
}
export interface InstructionData {
    instruction: string;
    instructionFile?: string;
}
export interface AnswerChoice {
    [AnswerChoiceDataKeys.ANSWER_CHOICE]: string;
    [AnswerChoiceDataKeys.IS_CORRECT]: boolean;
}
export interface AssessmentData {
    id?: string;
    assessment?: string;
    assessmentQuestion: string;
    answerChoices: AnswerChoice[];
}
export interface LessonGet {
    [LessonDataKeys.ID]: string;
    [LessonDataKeys.TOPIC_ID]?: string;
    [LessonDataKeys.TOPIC]?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [LessonDataKeys.INSTRUCTION]: any;
    [LessonDataKeys.INSTRUCTION_FILE]?: string;
    [LessonDataKeys.SIMPLE_ANSWER]: boolean;
    [LessonDataKeys.ASSESSMENT_QUESTION]: string;
    [LessonDataKeys.ANSWER_CHOICES]: AnswerChoice[];
    [LessonDataKeys.ASSESSMENT]: AssessmentData[];
    [LessonDataKeys.CREATED_BY_USER_ID]?: string;
}
