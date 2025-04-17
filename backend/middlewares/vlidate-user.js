import userValidator from "../validators/auth-validator.js"

const validateUser = async (req, res, next) => {
    
        try {
            const result = userValidator.safeParse(req.body)
            if(!result.success) return res.status(401).json({message: result.error.errors[0].message})
        
        next()
        } catch (error) {
            res.json({message: error})
        }
    
}

export default validateUser;