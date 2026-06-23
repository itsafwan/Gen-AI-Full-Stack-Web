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

const MetadataSchema = new mongoose.Schema({
  model: { type: String, required: true },
  promptVersion: { type: String, default: "1.0" },
  processingTime: Number,
  tokensUsed: Number
}, { _id: false });


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

  technicalQuestions:[technicalquestion],
  behavioraltechnicalQuestion:[behaviroalquestion],
  skillgap:[skillgap],
  preparationplan:[preparation],
  aiMetadata: MetadataSchema,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
  }
},{
  timestamps:true
})

const interviewmodel = mongoose.model("InterviewReports",interview)

export default interviewmodel;