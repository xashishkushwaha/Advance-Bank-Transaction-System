const mongoose = require("mongoose")
const ledgerModel = require("./ledger.model")

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [ true, "Account must be associated with a user" ],
        index: true
        // This field is indexed for faster searches using  B+ Tree Backend
    },
    status: {
        type: String,
        enum: {
            values: [ "ACTIVE", "FROZEN", "CLOSED" ],
            message: "Status can be either ACTIVE, FROZEN or CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [ true, "Currency is required for creating an account" ],
        default: "INR"
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 })
// This compound index allows for efficient queries that filter by both user and status, which is a common use case in banking applications.

// accountModel.findOne({ ... })       // called on the model
// accountModel.findOneAndUpdate(...)  // called on the model
// account.getBalance()                // called on one document
// accountModel.getBalance()           // wrong: not a function

accountSchema.methods.getBalance = async function () {

    const balanceData = await ledgerModel.aggregate([ 
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "DEBIT" ] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: [ "$type", "CREDIT" ] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: [ "$totalCredit", "$totalDebit" ] }
            }
        }
    ])

    // for new accounts, there will be no ledger entries, so the balance will be 0. Hence, we need to check if the balanceData array is empty and return 0 in that case.
    if (balanceData.length === 0) {
        return 0
    }

    return balanceData[ 0 ].balance

}


const accountModel = mongoose.model("account", accountSchema)



module.exports = accountModel