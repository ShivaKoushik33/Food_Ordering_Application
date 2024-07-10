const Firm=require("../Models/Firm");
const Vendor=require("../Models/Vendor");
const multer=require("multer");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload=multer({storage:storage});


const addFirm=async(req,res)=>{

   try{
    const{firmName,area,category,region,offer}=req.body;

    const image=req.file?req.file.filename:undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        res.status(404).json({message:"Vendor not found"});
    }
    const firm=new Firm({
        firmName,area,category,region,offer,image,vendor:vendor._id
    })

    const savedFirm =await firm.save();
    vendor.firm.push(savedFirm);
    return res.status(200).json({message:"Firm added successfullty"})
   }
   catch(error){
    console.error(error);
    res.status(500).json("Internal server error");
   }
}

const deleteFirmById=async(req,res)=>{
  firmId=req.params.firmId;
  const deletedFirm=await Firm.findByIdAndDelete(firmId);
  try{
    if(!deletedFirm){
      res.stauts(404).json("No Firm found");
  }
}
catch(error){
  console.error(error);
  res.status(500).json("Internal server error");
 }
}

module.exports={addFirm:[upload.single("image"),addFirm],deleteFirmById}