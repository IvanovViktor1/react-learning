import { PayloadAction, createSlice,  } from "@reduxjs/toolkit";
import { Status, QuestionSliceState, Answer, Question} from "./types";
import { fetchQuestions} from "./asyncActions";
import { useSelector } from "react-redux";
import { SelectTopicData } from "redux/topic/selectors";

function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;
  // Пока остаются элементы для перемешивания...
  while (currentIndex !== 0) {
    // Выбираем оставшийся элемент...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // И меняем его местами с текущим элементом.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const initialState: QuestionSliceState = {
    questions:[] ,
    questionsRnd:[] ,
    status: Status.LOADING 
}; 

const questionsSlice = createSlice({
    name: "questions",
    initialState,  
    reducers: {

      

      updateQuestion(state, action: PayloadAction<Question>){
        const {id, title, answers} = action.payload
        let findQuestion = state.questions.find(q => q.id === id) as Question;
        findQuestion.title = title;
        findQuestion.answers = answers;
      },

      updateAnswer(state, action: PayloadAction<{idQuestion: number, answer: Answer}>){
        
        const {id, text, isCorrect} = action.payload.answer
        
        let findQuestion = state.questions.find(q => q.id === action.payload.idQuestion) as Question;
        let findAnswer = findQuestion.answers?.find(ans=> ans.id === id) as Answer
        
        findAnswer.text = text
        findAnswer.isCorrect = isCorrect
      },
      addNewQuestion(state, action: PayloadAction<{id: number,
        title: string,
        answers: Answer[],
        topic_id: number }>) {
        state.questions.push(action.payload);
      },

      updateQuestionText(state, action: PayloadAction<{ questionId: number, newText: string}>) {
        let findQuestion = state.questions.find(question => question.id === action.payload.questionId) as Question
        findQuestion.title = action.payload.newText
      },

      addNewAnswer(state, action: PayloadAction<{ idQuestion: number, newAnswer: Answer}>){
        let findQuestion = state.questions?.find(question => question.id === action.payload.idQuestion)
        console.log(action.payload.newAnswer)
        let answers = state.questions?.find(question => question.id === findQuestion?.id)?.answers as Answer[]
        console.log(answers)
        if (answers !== null){
          answers.push(action.payload.newAnswer) 
        } else {
          answers = [{
            id: 1,
            text: "",
            isCorrect: false
          }]
        }
      },

      removeAnswer(state, action: PayloadAction<{idQuestion: number, idAnswer: number}>) {
        let findQuestion = state.questions?.find(question => question.id === action.payload.idQuestion) as Question
        findQuestion.answers = findQuestion.answers?.filter(answer => answer.id !== action.payload.idAnswer) as Answer[]
     },

      updateAnswerText(state, action: PayloadAction<{questionId: number, idAnswer: number, newText: string}>) {
        let findQuestion = state.questions?.find(question => question.id === action.payload.questionId) as Question
        let findAnswer = findQuestion.answers?.find(answer => answer.id === action.payload.idAnswer) as Answer
        findAnswer.text = action.payload.newText
      },
      
     
      deleteQuestion(state, action: PayloadAction<number>){
        let newArrQuewstion = state.questions.filter(question => question.id !== action.payload) as Question[]
        state.questions = newArrQuewstion
      }
    }, 
    extraReducers: (builder) => {
        builder.addCase(fetchQuestions.fulfilled, (state, action) => {
          const ap = action.payload 
        state.questions = action.payload;  
        state.questionsRnd = shuffleArray([...ap]);
        state.status = Status.SUCCESS;
        })
        builder.addCase(fetchQuestions.pending, (state) => {
          state.status = Status.LOADING;
          state.questions = [];
        })
        builder.addCase(fetchQuestions.rejected, (state) => {
          state.status = Status.ERROR;
          state.questions = [];
        })
    }
})

export const { updateAnswerText, removeAnswer, addNewAnswer, updateQuestionText, addNewQuestion, updateQuestion, updateAnswer, deleteQuestion} = questionsSlice.actions;

export default questionsSlice.reducer;