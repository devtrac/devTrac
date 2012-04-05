function Validator(){
}

Validator.prototype.isValidDate = function(date) {
    var matches = /^(\d{2})[\/](\d{2})[\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var day = matches[1];
    var month = matches[2]-1;
    var year = matches[3];
    
    var composedDate = new Date(year, month, day);
    return ((composedDate.getMonth() == month) && (composedDate.getDate() == day) && (composedDate.getFullYear() == year));
}