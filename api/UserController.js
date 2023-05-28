import User from "./User.js"
class UserController{
    async create(req, res) {
        try {
            const {user_name, user_id, first_name, user_city} = req.body
            const query = await User.find({user_id: user_id})
            if(query.length !== 0){
                let check = false
                for (const queryElement of query) {
                    if(queryElement.user_id == user_id){
                        if(queryElement.user_name !== user_name){
                            const userdel = await User.deleteOne({user_id})
                            const usercre = await User.create({user_name, user_id, first_name})
                            return res.status(200).json(usercre)
                        }else {
                            check = true
                        }
                        if(queryElement.first_name !== first_name){
                            const userdel = await User.deleteOne({user_id})
                            const usercre = await User.create({user_name, user_id, first_name})
                            return res.status(200).json(usercre)
                        }else {
                            check = true
                        }
                        if(queryElement.user_city !== user_city){
                            if(user_city !== undefined){
                                const userdel = await User.deleteOne({user_id})
                                const usercre = await User.create({user_name, user_id, first_name, user_city})
                                return res.status(200).json(usercre)
                            }
                        }
                    }
                }
                if(check !== true){
                    const user = await User.create({user_name, user_id, first_name, user_city})
                    res.status(200).json(user)
                }
            }else{
                const user = await User.create({user_name, user_id, first_name, user_city})
                res.status(200).json(user)
            }
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async getAll(req, res){
        try {
            const users = await User.find()
            return res.status(200).json(users)
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async delUser(req,res){
        try{
            const {user_id} = req.params
            const user = await User.deleteOne({user_id})
            return res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e)
        }
    }

}

export default new UserController()