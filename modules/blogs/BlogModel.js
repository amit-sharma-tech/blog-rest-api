const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    title :{
        type: String,
        required : "Invaild blog title",
        trim : true,
    },
    slug : {
        type:String,
        required: 'Invliad slig for blog',
        trim: true,
        unique:true,
        index:true
    },
    metatitle: {
        type:String,
        required:'Invliad meta title'
    },
    summary :{
        type:String,
        required:'Invalid text'
    },
    content:{
        type:String,
        required:'Invalid content',
        trim: true
    },
    published :{
        type: Number,
        default:0
    },
    createdAt:{
        type    :   Date,
        default :   Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
    publishedAt:{
        type: Date,
        default: null
    },
});

blogSchema.methods.create_slug = (title) => {
    return title
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'');
}

const Blog = mongoose.model('Blog',blogSchema);
module.exports = Blog;