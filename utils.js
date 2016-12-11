module.exports = function(ObjectId) {

    var validate = function(id) {
        id = id.toString().toLowerCase()

        if(!ObjectId.isValid(id)) {
            return false;
        }

        var obj = new ObjectId(id)
        return obj.toString() === id;
    }

    var containsId = function(arr, id) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i].equals(id)) {
                return true
            }
        }

        return false
    }

    var extractErrorMessage = function(err) {
        if(err.errors) {
            return err.errors[Object.keys(err.errors)[0]]
        }
        else {
            return err
        }
    }

    var copy = function(dest, src, prop) {
        if(typeof src[prop] !== "undefined") {
            dest[prop] = src[prop]
        }
    }

    return {
        validate: validate,
        extractErrorMessage: extractErrorMessage,
        copy: copy,
        containsId: containsId
    }
}