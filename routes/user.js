const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//Sign Up
router.post("/sign-up", async (req,res) => {
    try{
        const { username, email, password, address } =req.body;

        //check username length is more then 3
        if(username.length < 4){
            return res
            .status(400)
            .json({ message: "Username length should be greater than 3"});
        }

        //check username already exits ??
        const existingUsername = await User.findOne({ username: username });

        if(existingUsername) {
            return res
                .status(400)
                .json({ message: "Username Already exists" });
        }

        //check email already exits ??
        const existingEmail = await User.findOne({ email: email });

        if (existingEmail) {
            return res.status(400).json({ message: "Email Already exists" });
        }

        //check Password Length
        if (password.length <= 5) {
            return res
                .status(400)
                .json({ message: "Password Should be greater then 5" });
        }

        const hashPass = await bcrypt.hash(password,10);
        const newUser = new User({ 
            username: username, 
            email: email,
            password: hashPass,
            address: address, 
        });

        await newUser.save();
        return res.status(200).json({ message: "SignUp Successfully"});

    } catch (error) {
        res.status(500).json({ message:"Internal server Error!!" })
    }
});


// Sign-In
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        //check username already exits ??
        const existingUser = await User.findOne({ username });

        if (!existingUser) {
            return res
                .status(400)
                .json({ message: "Invalid Credentials" });
        }

        await bcrypt.compare(password, existingUser.password,(err,data) =>{
            if(data){
                const authClaims = [
                    {name: existingUser.username},
                    {role: existingUser.role}
                ]

                // Secret key for JWT and Sign
                const token = jwt.sign({ authClaims }, "bookStore123", {expiresIn: "24h",});

                res.status(200)
                .json({ id: existingUser.id, role: existingUser.role, token:token, message: "SignIn Success" });
            } else {
                res.status(400)
                .json({ message: "Invalid Credentials" });
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error"});
    }
});


//get-user-information
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


//update profile from user setting panel
router.put("/update-profile", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { username, email, address, avatar } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, address, avatar },
            { new: true }
        );

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
