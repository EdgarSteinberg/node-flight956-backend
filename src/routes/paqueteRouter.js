import {Router} from 'express';
import PaqueteManager from "../controllers/paqueteController.js";
const paqueteService = new PaqueteManager();

const router = Router();


router.get("/" ,async (req,res ) => {
    try{
        const result = await paqueteService.getAllPaquete();
        res.status(200).send({status: "success", payload: result});
    }catch(error){
        res.status(500).send({status: "error", error: error.message});
    }
});

router.get("/:pid" ,async (req,res ) => {
    const{pid} = req.params;
    try{
        const result = await paqueteService.getPaqueteById(pid);
        res.status(200).send({status: "success", payload: result});
    }catch(error){
        res.status(500).send({status: "error", error: error.message});
    }
});

router.post("/" ,async (req,res ) => {
    try{
        const result = await paqueteService.createPaquete(req.body);
        res.status(200).send({status: "success", payload: result});
    }catch(error){
        res.status(500).send({status: "error", error: error.message});
    }
});


router.put("/:pid" ,async (req,res ) => {
    const{pid} = req.params;
    const updated = req.body;
    try{
        const result = await paqueteService.updatedPaquete(pid, updated);
        res.status(200).send({status: "success", payload: result});
    }catch(error){
        res.status(500).send({status: "error", error: error.message});
    }
});

router.delete("/:pid" ,async (req,res ) => {
    const{pid} = req.params;
    try{
        const result = await paqueteService.deletePaquete(pid);
        res.status(200).send({status: "success", payload: result});
    }catch(error){
        res.status(500).send({status: "error", error: error.message});
    }
});


export default router;