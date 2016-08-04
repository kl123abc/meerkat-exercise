function getArrayOfUniqueRandomIntegersFromRange(max, numberOfElements, min = 0) {
    var arrayOfRandomIntegers = new Array();
    for (var i = 0; i < numberOfElements; i++) {
        var randomInt = getRandomUniqueIntegerFromRange(max, arrayOfRandomIntegers, min);
        arrayOfRandomIntegers.push(randomInt)
    }
    return arrayOfRandomIntegers;
}

function getRandomUniqueIntegerFromRange(max, values, min = 0) {
    var randomInt = null;
    do {
        randomInt = Math.floor(Math.random() * (max - min ) + min);
    }
    while ($.inArray(randomInt, values) != -1);
    return randomInt;
}

function getWidthOfOnePosition(widthOfContainer, numberOfElements) {
    return widthOfContainer / numberOfElements;
}

function setEvenWidthOfElementsInGroup(widthOfPosition, groupOfElements) {
    var widthOfOneElement = $(groupOfElements)[0].width;
    var widthOfOnePadding = (((widthOfPosition - widthOfOneElement) / 2) - 4);
    groupOfElements.css("padding", ("0 " + Math.floor(widthOfOnePadding) + "px 0 " + Math.floor(widthOfOnePadding) + "px"));
}

function fillBoxWithFixedNumberOfElements(box, element, numberOfPositions, cssClass, imageStyling, numberOfRows = 1) {
    for (var i = 0; i < numberOfPositions; i++) {
        $(box).append(element);
    }
    var numberOfElements = cssClass == 'meerkat' ? numberOfPositions : Math.abs(numberOfPositions / numberOfRows);
    var groupOfElements = $("." + cssClass);
    groupOfElements.addClass(imageStyling);
    setEvenWidthOfElementsInGroup(getWidthOfOnePosition(window.innerWidth, numberOfElements), groupOfElements);
}

function hideNumberOfElements(elementsClass, numberToStayVisible) {
    var groupOfElements = $('.' + elementsClass);
    var numberOfPositions = groupOfElements.length;
    var randomPositions = getArrayOfUniqueRandomIntegersFromRange(numberOfPositions, numberToStayVisible);
    for (var i = 0; i < numberOfPositions; i++) {
        if ($.inArray(i, randomPositions) == -1) {
            $(groupOfElements[i]).addClass('invisible');
        }
    }
}

function hideElementsBasedOnArray(elementsClass, visibleElements) {
    var groupOfElements = $('.' + elementsClass);
    for (var i = 0; i < $(groupOfElements).length; i++) {
        if (visibleElements[i] == 0) {
            $($(groupOfElements).get(i)).addClass('invisible');
        }
    }
}

function createArrayOfElementsPositions() {
    var listOfPictures = $("img");
    var arrayOfPositions = [];
    var rowIndex = 0;
    arrayOfPositions[rowIndex] = [];
    for (var i = 0; i < listOfPictures.length; i++) {
        var picture = $(listOfPictures[i]);
        var offset = picture.offset();
        if (offset.left == 0 && i != 0) {
            rowIndex++;
            arrayOfPositions[rowIndex] = [];
        }
        if (picture.hasClass("invisible")) {
            arrayOfPositions[rowIndex].push(".");
        }
        else {
            var element = picture.hasClass("meerkat") ? 's' : 'c';
            arrayOfPositions[rowIndex].push(element);
        }
    }
    rowIndex++;
    arrayOfPositions[rowIndex] = [];
    for (var j = 0; j < arrayOfPositions[0].length; j++) {
        arrayOfPositions[rowIndex][j] = arrayOfPositions[0][j] == '.' ? '.' : 's';
    }
    return arrayOfPositions;
}

function markClickedElement(board, elementGroup) {
    var returnArray = new Array();
    for (var i = 0; i < $(elementGroup).length; i++) {
        var groupOfElements = $(elementGroup);
        if ($(groupOfElements[i]).hasClass("clicked")) {
            board[0][i] = "sc";
            returnArray.push(i)
        }
    }
    returnArray.push(board);
    return returnArray;
}

function markFromBoard(board) {
    var images = jQuery('img');
    for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 13; x++) {
            var iPosX = (y * 13) + x;
            images[iPosX].style.backgroundColor = board[y][x].indexOf('x') == -1 ? null : 'yellow';
        }
    }
}

function nextRowIsLast(row, length) {
    return (row + 1) == length;
}

function identifyNearestElement(board, column, row = 0) {
    var length = board.length - 1;
    var currentColumn = column;
    while (board[length][column] != "x") {
        if (nextRowIsLast(row,length)) {
            if (currentColumn == column) {
                board[length][currentColumn] = "x";
            }
            else {
                var factor = currentColumn > column ? -1 : 1;
                while (currentColumn != column) {
                    board[length][currentColumn] = "x";
                    currentColumn += factor;
                }
            }
        }
        else {
            var tempChangedVariables = checkNearFields(board, row, currentColumn, column);
            if (tempChangedVariables.result == false) {
                board[row][currentColumn] = "cx";
                row = row - 1;

                tempChangedVariables = checkNearFields(board, row, currentColumn, column);
            }
            row = tempChangedVariables.row;
            currentColumn = tempChangedVariables.currentColumn;
            board = tempChangedVariables.board;
            markFromBoard(board);
        }
    }
    return board;
}

function checkNearFields(board, row, currentColumn, column) {
    var checks = [];
    if (currentColumn == column) {
        checks = ['d','ld','rd','l','r'];
    }
    else if (currentColumn > column) {
        checks = ['ld','d','rd','l','r'];
    }
    else if (currentColumn < column) {
        checks = ['rd','d','ld','r','l'];
    }
    else {
        throw "currentColumn and column do not meet any logical or mathematical standards"
    }

    var checkField = null;
    for(var i=0; i<checks.length; i++) {
        if (checks[i] == 'd' && checkDown(board, row, currentColumn)) {
            checkField = jumpDown(board, row, currentColumn);
            break;
        }
        else if (checks[i] == 'ld' && checkLeftDown(board, row, currentColumn)) {
            checkField = jumpLeftDown(board, row, currentColumn);
            break;
        }
        else if (checks[i] == 'rd' && checkRightDown(board, row, currentColumn)) {
            checkField = jumpRightDown(board, row, currentColumn);
            break;
        }
        else if (checks[i] == 'l' && checkLeft(board, row, currentColumn)) {
            checkField = jumpLeft(board, row, currentColumn);
            break;
        }
        else if (checks[i] == 'r' && checkRight(board, row, currentColumn)) {
            checkField = jumpRight(board, row, currentColumn);
            break;
        }
    }

    var values = {"row": row, "currentColumn": currentColumn, "board": board, "result": false};
    if (checkField != null) {
        values.board = checkField.board;
        values.row = checkField.row;
        values.currentColumn = checkField.currentColumn;
        values.result = true;
    }
    return values;
}

//<editor-fold desc="checks">
function checkDown(board, row, currentColumn) {
    return board[row + 1][currentColumn] == "c";
}

function checkLeftDown(board, row, currentColumn) {
    return board[row + 1][currentColumn - 1] == "c";
}

function checkRightDown(board, row, currentColumn) {
    return board[row + 1][currentColumn + 1] == "c";
}

function checkLeft(board, row, currentColumn) {
    return board[row][currentColumn - 1] == "c" || board[row][currentColumn - 1] == "s";
}

function checkRight(board, row, currentColumn) {
    return board[row][currentColumn + 1] == "s" || board[row][currentColumn + 1] == "c";
}
//</editor-fold>
//<editor-fold desc="jumps">
function jumpDown( board, row, currentColumn ){
    board[row + 1][currentColumn] = "x";
    return {"row": row + 1, "result": true, "board": board, "currentColumn": currentColumn};
}

function jumpLeftDown(board, row, currentColumn){
    board[row + 1][currentColumn - 1] = "x";
    return {"row": row + 1, "result": true, "board": board, "currentColumn": currentColumn - 1};
}

function jumpRightDown(board, row, currentColumn){
    board[row + 1][currentColumn + 1] = "x";
    return {"row": row + 1, "result": true, "board": board, "currentColumn": currentColumn + 1};
}

function jumpLeft(board, row, currentColumn){
    board[row][currentColumn - 1] = "x";
    return {"row": row, "result": true, "board": board, "currentColumn": currentColumn - 1};
}

function jumpRight(board, row, currentColumn){
    board[row][currentColumn + 1] = "x";
    return {"row": row, "result": true, "board": board, "currentColumn": currentColumn + 1};
}
//</editor-fold>

function clickHandler(elementGroup) {
    $(elementGroup).click(function () {
        var board = createArrayOfElementsPositions();
        $('.clicked').removeClass('clicked');
        $(this).addClass("clicked");
        board = markClickedElement(board, elementGroup);
        identifyNearestElement(board[1], board[0]);
    });
}

$(document).ready(function () {
    var crocodile = "<img src='images/krokodyl.png' alt='crocodile' class='crocodile'/>";
    var meerkat = "<img src='images/surykatka.png' alt='meerkat' class='meerkat' />";

    fillBoxWithFixedNumberOfElements("#meerkatPositions", meerkat, 13, 'meerkat', 'meerkatStyling', 1);
    //hideNumberOfElements('meerkat', 10);
    hideElementsBasedOnArray('meerkat', [1, 0, 1, 1, 1, 0,1, 1, 1, 1, 0, 1, 1]);// - DEBUG ONLY

    fillBoxWithFixedNumberOfElements("#rzeka", crocodile, 52, 'crocodile', 'crocodileStyling', 4);
    //hideNumberOfElements('crocodile', 34);
    hideElementsBasedOnArray('crocodile', [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1,
        0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1,
        0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1,
        1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1
    ]);//  - DEBUG ONLY */
    clickHandler(".meerkat");
});


