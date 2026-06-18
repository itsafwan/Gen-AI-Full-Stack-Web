import mongoose from "mongoose";

/**
   * @name interview Model
   * @description Mongoose schema and model for Resume text ,Self description, Technical questions,Skill gaps, Preparation plan
   * @access Public
*/

const technicalquestion = new mongoose.Schema({

    question:{
    type:String, 
    required:[true,"Technical question is required"]
  },
    intention:{
    type:String, 
    required:[true,"Intention question is required"]
  },
    answer:{
    type:String, 
    required:[true,"Answer is required"]
  },

},{
  _id:false
})

const behaviroalquestion = new mongoose.Schema({

    question:{
    type:String, 
    required:[true,"Technical question is required"]
  },
    intention:{
    type:String, 
    required:[true,"Intention question is required"]
  },
    answer:{
    type:String, 
    required:[true,"Answer is required"]
  },

},{
  _id:false
})

const skillgap = new mongoose.Schema({

    skill:{
    type:String, 
    required:[true,"skill is required"]
  },
    severity:{
    type:String, 
    enum:["low","medium","high"],
    required:[true,"severity  is required"]
  }

},{
  _id:false
})

const preparation = new mongoose.Schema({

    day:{
    type:String, 
    required:[true,"Day is required"]
  },
    focus:{
    type:String, 
    required:[true,"focus is required"]
  },
  task:[{
    type:String, 
    required:[true,"Task is required"]
  }]
},{
  _id:false
})

const Metadata = new mongoose.Schema({

  // AI Metadata field 
  aiMetadata: {
    model: {
      type: String, // e.g., "gpt-4o", "gemini-1.5-pro"
      required: true
    },
    promptVersion: {
      type: String, // e.g., "v1.2" (if you want to change your prompt)
      default: "1.0"
    },
    processingTime: {
      type: Number // milliseconds (for AI response time track )
    },
    tokensUsed: {
      type: Number // Cost analysis 
    }
  },

},{
  _id:false
})


const interview = new mongoose.Schema({

  jobDescription:{
    type:String, 
    required:[true,"Job Description is required"]
  },
  resume:{
    type:String
  },
  selfDescription:{
    type:String
  },
  matchscore:{
    type:Number, 
    min:0, 
    max:100
  },

  technicalQuestion:[technicalquestion],
  behavioraltechnicalQuestion:[behaviroalquestion],
  skillgap:[skillgap],
  preparationplan:[preparation],
  aiMetadata:[Metadata]

},{
  timestamps:true
})

const interviewmodel = mongoose.model("InterviewReports",interview)

export default interviewmodel;