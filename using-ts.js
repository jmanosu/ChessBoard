var DefaultChessLayout = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var ChessPieceType;
(function (ChessPieceType) {
    ChessPieceType[ChessPieceType["King"] = 0] = "King";
    ChessPieceType[ChessPieceType["Queen"] = 1] = "Queen";
    ChessPieceType[ChessPieceType["Bishop"] = 2] = "Bishop";
    ChessPieceType[ChessPieceType["Knight"] = 3] = "Knight";
    ChessPieceType[ChessPieceType["Castle"] = 4] = "Castle";
    ChessPieceType[ChessPieceType["Pawn"] = 5] = "Pawn";
})(ChessPieceType || (ChessPieceType = {}));
var ChessPiece = /** @class */ (function () {
    function ChessPiece(type, white) {
        this.type = type;
        this.white = white;
    }
    ChessPiece.prototype.getType = function () {
        return this.type;
    };
    ChessPiece.prototype.isWhite = function () {
        return this.white;
    };
    return ChessPiece;
}());
var Square = /** @class */ (function () {
    function Square() {
        this._chessPiece = null;
    }
    Square.prototype.setPiece = function (chessPiece) {
        this._chessPiece = chessPiece;
    };
    Square.prototype.getPiece = function () {
        return this._chessPiece;
    };
    return Square;
}());
var ChessBoard = /** @class */ (function () {
    function ChessBoard(canvas, image) {
        if (canvas === void 0) { canvas = null; }
        if (image === void 0) { image = null; }
        this._canvas = canvas;
        this._ctx = (canvas) ? canvas.getContext("2d") : null;
        this._image = image;
        this._squareWidth = 40;
        this._darkSquareColor = "#CABCD9";
        this._lightSquareColor = "#f9e2dd";
        this._squares = Array();
        this._width = 8;
        this._height = 8;
        for (var i = 0; i < this._height; i++) {
            this._squares[i] = Array();
            for (var j = 0; j < this._width; j++) {
                this._squares[i][j] = new Square();
            }
        }
    }
    ChessBoard.prototype.Init = function (canvas, image) {
        if (canvas === void 0) { canvas = null; }
        if (image === void 0) { image = null; }
        this._canvas = canvas;
        this._ctx = (canvas) ? canvas.getContext("2d") : null;
        this._image = image;
        this.LoadBoard(DefaultChessLayout);
    };
    ChessBoard.prototype.ClearBoard = function () {
        for (var i = 0; i < this._height; i++) {
            for (var j = 0; j < this._width; j++) {
                this._squares[i][j].setPiece(null);
            }
        }
    };
    ChessBoard.prototype.LoadBoard = function (fen) {
        this.ClearBoard();
        var row = 7;
        var column = 0;
        for (var i = 0; i < fen.length; ++i) {
            switch (fen[i]) {
                case '/':
                    --row;
                    column = 0;
                    break;
                case ' ':
                    i = fen.length;
                    break;
                default:
                    var piece = this.GetPiece(fen[i]);
                    if (piece != null && row <= 7 && row >= 0 && column <= 7 && column >= 0) {
                        this._squares[row][column].setPiece(piece);
                        ++column;
                    }
                    if (fen[i] >= '1' && fen[i] <= '8') {
                        column += Number(fen[i]);
                    }
                    break;
            }
        }
        this.drawBoard();
    };
    ChessBoard.prototype.GetPiece = function (fen) {
        if (fen.length == 0)
            null;
        switch (fen[0]) {
            case 'k':
                return new ChessPiece(ChessPieceType.King, true);
            case 'q':
                return new ChessPiece(ChessPieceType.Queen, true);
            case 'b':
                return new ChessPiece(ChessPieceType.Bishop, true);
            case 'n':
                return new ChessPiece(ChessPieceType.Knight, true);
            case 'r':
                return new ChessPiece(ChessPieceType.Castle, true);
            case 'p':
                return new ChessPiece(ChessPieceType.Pawn, true);
            case 'K':
                return new ChessPiece(ChessPieceType.King, false);
            case 'Q':
                return new ChessPiece(ChessPieceType.Queen, false);
            case 'B':
                return new ChessPiece(ChessPieceType.Bishop, false);
            case 'N':
                return new ChessPiece(ChessPieceType.Knight, false);
            case 'R':
                return new ChessPiece(ChessPieceType.Castle, false);
            case 'P':
                return new ChessPiece(ChessPieceType.Pawn, false);
            default:
                return null;
        }
    };
    ChessBoard.prototype.drawBoard = function () {
        if (!this.ClearCanvas())
            return;
        for (var i = 0; i < this._height; i++) {
            for (var j = 0; j < this._width; j++) {
                var x = j * this._squareWidth;
                var y = i * this._squareWidth;
                if ((i + j) % 2) {
                    this.DrawSquare(x, y, this._darkSquareColor);
                }
                else {
                    this.DrawSquare(x, y, this._lightSquareColor);
                }
                var piece = this._squares[i][j].getPiece();
                console.log(piece);
                if (piece != null) {
                    switch (piece.getType()) {
                        case ChessPieceType.King:
                            this.DrawKingImage(x, y, piece.isWhite());
                            break;
                        case ChessPieceType.Queen:
                            this.DrawQueenImage(x, y, piece.isWhite());
                            break;
                        case ChessPieceType.Bishop:
                            this.DrawBishopImage(x, y, piece.isWhite());
                            break;
                        case ChessPieceType.Knight:
                            this.DrawKnightImage(x, y, piece.isWhite());
                            break;
                        case ChessPieceType.Castle:
                            this.DrawCastleImage(x, y, piece.isWhite());
                            break;
                        case ChessPieceType.Pawn:
                            this.DrawPawnImage(x, y, piece.isWhite());
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    };
    ChessBoard.prototype.ClearCanvas = function () {
        if (!this._ctx)
            return false;
        if (!this._canvas)
            return false;
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        return true;
    };
    ChessBoard.prototype.DrawSquare = function (x, y, color) {
        if (!this._ctx)
            return;
        this._ctx.fillStyle = color;
        this._ctx.fillRect(x, y, this._squareWidth, this._squareWidth);
    };
    ChessBoard.prototype.DrawKingImage = function (x, y, white) {
        if (!this._ctx || !this._image)
            return;
        this._ctx.drawImage(this._image, 0, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    };
    ChessBoard.prototype.DrawQueenImage = function (x, y, white) {
        if (!this._ctx || !this._image)
            return;
        this._ctx.drawImage(this._image, 133, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    };
    ChessBoard.prototype.DrawBishopImage = function (x, y, white) {
        if (!this._ctx || !this._image)
            return;
        this._ctx.drawImage(this._image, 266, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    };
    ChessBoard.prototype.DrawKnightImage = function (x, y, white) {
        if (!this._ctx || !this._image)
            return;
        this._ctx.drawImage(this._image, 399, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    };
    ChessBoard.prototype.DrawCastleImage = function (x, y, white) {
        if (!this._ctx || !this._image)
            return;
        this._ctx.drawImage(this._image, 532, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    };
    ChessBoard.prototype.DrawPawnImage = function (x, y, white) {
        if (!this._ctx || !this._image)
            return;
        this._ctx.drawImage(this._image, 665, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    };
    return ChessBoard;
}());
var canvas = document.getElementById("board");
var fen = document.getElementById("fen");
var button = document.querySelector("button");
var chessBoard = new ChessBoard();
var ChessPiecesImage = new Image();
ChessPiecesImage.src = "./ChessPieces.png";
ChessPiecesImage.onload = function () {
    chessBoard.Init(canvas, ChessPiecesImage);
};
button === null || button === void 0 ? void 0 : button.addEventListener("click", function () {
    chessBoard.LoadBoard(fen.value);
});
