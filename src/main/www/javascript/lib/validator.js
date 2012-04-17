function Validator(){
}

Validator.isValidDate = function(date) {
    var matches = /^(\d{2})[\/](\d{2})[\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var day = matches[1];
    var month = matches[2]-1;
    var year = matches[3];

    var composedDate = new Date(year, month, day);
    return ((composedDate.getMonth() == month) && (composedDate.getDate() == day) && (composedDate.getFullYear() == year));
}

Validator.isOutrangedDate = function(date){
    var matches = /^(\d{2})[\/](\d{2})[\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var day = matches[1];
    var month = matches[2]-1;
    var year = matches[3];

    var composedDate = new Date(year, month, day);

    var startDate = this.parseDate(devtrac.fieldTrip.startDate);
    var endDate = this.parseDate(devtrac.fieldTrip.endDate);
    return startDate > composedDate || endDate < composedDate;
}

Validator.parseDate = function(dateString) {
    var year = dateString.substring(0,4);
    var month = dateString.substring(5,7) - 1;
    var day = dateString.substring(8,10);

    return new Date(year, month, day);
}

Validator.dateToString = function(date) {
    var monthString = (date.getMonth()+1).toString();
    if (monthString.length==1){
        monthString = "0" + monthString;
    }
    var dateString = date.getDate().toString();
    if (dateString.length==1){
        dateString = "0" + dateString;
    }
    var string = dateString + "/" + monthString + "/" + date.getFullYear();
    return string;
}