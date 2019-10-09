'use strict';
var MARKS = {
    A: 'fa-cat'
    , B: 'fa-ghost'
    , C: 'fa-spider'
    , D: 'fa-crow'
    , EMPTY: ''
}

var markOfPlayer;

var tempSelected;
var MyCell = function (x, y, mark, tdElement, iElement) {
    this.x = x;
    this.y = y;
    this.mark = mark;
    this.tdElement = tdElement;
    this.iElement = iElement;
    this.arounds = {};
    // this.put = false;
    this.styleClass = ['defaultArea'];

    // イベントの登録
    this.tdElement.addEventListener('click', this.clickTemp.bind(this));
}
MyCell.prototype.show = function () {
    var that = this;
    // setTimeout(function () {
    that.iElement.classList.remove('fa-cat');
    that.iElement.classList.remove('fa-ghost');
    that.iElement.classList.remove('fa-spider');
    that.iElement.classList.remove('fa-crow');

    if (this.mark !== MARKS.EMPTY) {
        that.iElement.classList.add(this.mark);
    }

    if (that.mark === MARKS.A) {
        that.iElement.style.color = 'gold';
    } else if (that.mark === MARKS.B) {
        that.iElement.style.color = 'deepskyblue';
    } else if (that.mark === MARKS.C) {
        that.iElement.style.color = 'hotpink';
    } else if (that.mark === MARKS.D) {
        that.iElement.style.color = 'limegreen';
    }

    that.tdElement.classList.remove('deleteArea');
    that.tdElement.classList.remove('putArea');
    that.tdElement.classList.remove('defaultArea');
    if (that.styleClass.length === 1) {
        that.tdElement.classList.add(that.styleClass[0]);
    } else {
        that.tdElement.classList.add('deleteArea');
    }

}

// 仮置き
MyCell.prototype.clickTemp = function () {

    if (this.mark !== MARKS.EMPTY) {
        return;
    }

    var allFiltered = this.getAllFiltered();

    if (allFiltered.length > 0) {
        // 削除できる範囲を色つける
        myCells.forEach(myCell => {
            if (allFiltered.indexOf(myCell) >= 0) {
                myCell.styleClass = ['deleteArea'];

            } else {
                if (myCell.styleClass.indexOf('putArea') >= 0) {
                    myCell.styleClass = ['putArea'];
                } else {
                    myCell.styleClass = ['defaultArea'];
                }
            }
            myCell.show();
        });

        tempSelected = this;

        this.styleClass.push('deleteArea');

        this.show();

        enablePutBTN();
    }

}

MyCell.prototype.clickFunc = function () {

    if (this.mark !== MARKS.EMPTY) {
        return;
    }
    // this.mark = MARKS.A;
    var allFiltered = this.getAllFiltered();

    if (allFiltered.length > 0) {
        // 自分のマークを置く
        this.mark = markOfPlayer;

        // 
        allFiltered.forEach(cell => {
            cell.mark = markOfPlayer;
        });

        // マークを次に
        nextMark();

        // 置けるところの補助
        resetPut();

        // myCellsを表示する
        showAllCells();
    }

}
MyCell.prototype.getAllFiltered = function () {
    var allFiltered = [];
    for (var prop in this.arounds) {
        var filtered = this.filterArounds(prop, markOfPlayer, []);
        allFiltered = allFiltered.concat(filtered);
    }
    return allFiltered;
}

MyCell.prototype.filterArounds = function (prop, firstMark, filtered) {
    var around = this.arounds[prop];
    if (!around || around.mark === MARKS.EMPTY) {
        return [];
    }

    if (firstMark === around.mark) {
        return filtered;
    } else {
        filtered.push(around);
        return around.filterArounds(prop, firstMark, filtered);
    }

}


var target = document.getElementById('target');

var myCells = [];

var nextMark = function () {

    if (markOfPlayer === MARKS.A) {
        setMark(MARKS.B);
    } else if (markOfPlayer === MARKS.B) {
        setMark(MARKS.C);
    } else if (markOfPlayer === MARKS.C) {
        setMark(MARKS.D);
    } else if (markOfPlayer === MARKS.D) {
        setMark(MARKS.A);
    }


}

var setMark = function (mark) {
    // 初期マークの設定
    markOfPlayer = mark;
    //　画面表示
    if (mark === MARKS.A) {
        document.getElementById('selectedMarkA').style.color = 'gold';
        document.getElementById('selectedMarkB').style.color = 'gray';
        document.getElementById('selectedMarkC').style.color = 'gray';
        document.getElementById('selectedMarkD').style.color = 'gray';
    }
    if (mark === MARKS.B) {
        document.getElementById('selectedMarkA').style.color = 'gray';
        document.getElementById('selectedMarkB').style.color = 'deepskyblue';
        document.getElementById('selectedMarkC').style.color = 'gray';
        document.getElementById('selectedMarkD').style.color = 'gray';
    }
    if (mark === MARKS.C) {
        document.getElementById('selectedMarkA').style.color = 'gray';
        document.getElementById('selectedMarkB').style.color = 'gray';
        document.getElementById('selectedMarkC').style.color = 'hotpink';
        document.getElementById('selectedMarkD').style.color = 'gray';
    }
    if (mark === MARKS.D) {
        document.getElementById('selectedMarkA').style.color = 'gray';
        document.getElementById('selectedMarkB').style.color = 'gray';
        document.getElementById('selectedMarkC').style.color = 'gray';
        document.getElementById('selectedMarkD').style.color = 'limegreen';
    }

    var aCount = 0;
    var bCount = 0;
    var cCount = 0;
    var dCount = 0;
    myCells.forEach(myCell => {

        if (myCell.mark === MARKS.A) {
            aCount++;
        }
        if (myCell.mark === MARKS.B) {
            bCount++;
        }
        if (myCell.mark === MARKS.C) {
            cCount++;
        }
        if (myCell.mark === MARKS.D) {
            dCount++;
        }

    })

    document.getElementById('aCount').textContent = aCount;
    document.getElementById('bCount').textContent = bCount;
    document.getElementById('cCount').textContent = cCount;
    document.getElementById('dCount').textContent = dCount;

    if ((aCount === 0 && mark === MARKS.A)
        || (bCount === 0 && mark === MARKS.B)
        || (cCount === 0 && mark === MARKS.C)
        || (dCount === 0 && mark === MARKS.D)) {
        document.getElementById('passBTN').style.display = 'block';
        document.getElementById('putBTN').style.display = 'none';
    } else {
        document.getElementById('passBTN').style.display = 'none';
        document.getElementById('putBTN').style.display = 'block';
    }
}

var enablePutBTN = function () {
    document.getElementById('putBTN').disabled = false;
}
var disablePutBTN = function () {
    document.getElementById('putBTN').disabled = true;
}

document.getElementById('putBTN').addEventListener('click', function () {
    tempSelected.clickFunc();
});


document.getElementById('passBTN').addEventListener('click', function () {
    nextMark();
    // 置けるところの補助
    resetPut();
    // myCellsを表示する
    showAllCells();
});
var resetPut = function () {
    // 置けるところを色変える
    myCells.forEach(myCell => {

        myCell.styleClass = ['defaultArea'];
        if (myCell.mark === MARKS.EMPTY) {
            if (myCell.getAllFiltered().length > 0) {
                myCell.styleClass = ['putArea'];
            }
        }
    });
}

var showAllCells = function () {

    myCells.forEach(myCell => {
        myCell.show();
    });

}


var initGame = function () {

    // myCellsをつくる
    for (var y = 0; y < 8; y++) {

        var tr = document.createElement('tr');

        for (var x = 0; x < 8; x++) {
            var td = document.createElement('td');
            var i = document.createElement('i');
            i.classList.add('fas');
            i.classList.add('fa-lg');
            var mark;
            if ((x === 3 && y === 2)
                || (x === 3 && y === 4)
                || (x === 5 && y === 4)) {
                mark = MARKS.A;
            } else if ((x === 4 && y === 2)
                || (x === 4 && y === 4)
                || (x === 2 && y === 4)) {
                mark = MARKS.B;
            } else if ((x === 2 && y === 3)
                || (x === 4 && y === 3)
                || (x === 4 && y === 5)) {
                mark = MARKS.C;
            } else if ((x === 3 && y === 3)
                || (x === 5 && y === 3)
                || (x === 3 && y === 5)) {
                mark = MARKS.D;
            } else {
                mark = MARKS.EMPTY;
            }

            var myCell = new MyCell(x, y, mark, td, i);
            myCells.push(myCell);
            td.appendChild(i);
            tr.appendChild(td);
        }

        target.appendChild(tr);
    }

    // aroundsを設定する
    myCells.forEach(myCell => {

        myCells.forEach(aroundCell => {

            if (myCell === aroundCell) {
                return;
            }

            if (aroundCell.y === myCell.y + 1) {
                if (aroundCell.x === myCell.x - 1) {
                    myCell.arounds.lt = aroundCell;
                }
                if (aroundCell.x === myCell.x) {
                    myCell.arounds.t = aroundCell;
                }
                if (aroundCell.x === myCell.x + 1) {
                    myCell.arounds.rt = aroundCell;
                }
            }

            if (aroundCell.y === myCell.y) {
                if (aroundCell.x === myCell.x - 1) {
                    myCell.arounds.l = aroundCell;
                }
                if (aroundCell.x === myCell.x + 1) {
                    myCell.arounds.r = aroundCell;
                }
            }

            if (aroundCell.y === myCell.y - 1) {
                if (aroundCell.x === myCell.x - 1) {
                    myCell.arounds.lb = aroundCell;
                }
                if (aroundCell.x === myCell.x) {
                    myCell.arounds.b = aroundCell;
                }
                if (aroundCell.x === myCell.x + 1) {
                    myCell.arounds.rb = aroundCell;
                }
            }
        })
    })

    // 初期マークの設定
    setMark(MARKS.A);

    // 置けるところの補助
    resetPut();

    // myCellsを表示する
    showAllCells();

}

initGame();