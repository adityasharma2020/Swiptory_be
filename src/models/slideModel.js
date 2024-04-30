import mongoose from 'mongoose';
import validator from 'validator';



const SlideModel = mongoose.models.SlideModel || mongoose.model('SlideModel', slideSchema);

export default SlideModel;
