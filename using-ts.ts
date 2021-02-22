const DefaultChessLayout = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

enum ChessPieceType {
    King = 0,
    Queen,
    Bishop,
    Knight,
    Castle,
    Pawn
}

class ChessPiece {
    type: ChessPieceType;
    white: boolean;

    constructor(type: ChessPieceType, white: boolean)
    {
        this.type = type;
        this.white = white;
    }

    getType()
    {
        return this.type;
    }

    isWhite()
    {
        return this.white;
    }
}

class Square {
    _chessPiece: ChessPiece | null;

    constructor()
    {
        this._chessPiece = null;
    }

    setPiece(chessPiece: ChessPiece | null)
    {
        this._chessPiece = chessPiece;
    }

    getPiece()
    {
        return this._chessPiece;
    }
}

class ChessBoard {
    _canvas: HTMLCanvasElement | null;
    _ctx: CanvasRenderingContext2D | null;
    _image: HTMLImageElement | null;
    _squareWidth: number;
    _darkSquareColor: string;
    _lightSquareColor: string;
    _squares: Array<Array<Square>>;
    _width: number;
    _height: number;

    constructor(canvas: HTMLCanvasElement | null = null, image: HTMLImageElement | null = null)
    {
        this._canvas = canvas;
        this._ctx = (canvas) ? canvas.getContext("2d") : null;
        this._image = image;
        this._squareWidth = 40;
        this._darkSquareColor = "#CABCD9";
        this._lightSquareColor = "#f9e2dd";
        this._squares =  Array<Array<Square>>();
        this._width = 8;
        this._height = 8;

        for (let i = 0; i < this._height; i++) {
            this._squares[i] = Array<Square>();
            for (let j = 0; j < this._width; j++) {
                this._squares[i][j] = new Square();
            }
        }
    }

    Init(canvas: HTMLCanvasElement | null = null, image: HTMLImageElement | null = null)
    {
        this._canvas = canvas;
        this._ctx = (canvas) ? canvas.getContext("2d") : null;
        this._image = image;
    
        this.LoadBoard(DefaultChessLayout);
    }


    ClearBoard()
    {
        for (let i = 0; i < this._height; i++) {
            for (let j = 0; j < this._width; j++) {
                this._squares[i][j].setPiece(null);
            }
        }
    }

    LoadBoard(fen : string)
    {
        this.ClearBoard();

        let row = 7;
        let column = 0;

        for (let i = 0; i < fen.length; ++i) {
            switch (fen[i]) {
                case '/':
                    --row;
                    column = 0;
                    break;
                case ' ':
                    i = fen.length;
                    break;
                default:
                    let piece = this.GetPiece(fen[i]);

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
    }

    GetPiece(fen: string)
    {
        if (fen.length == 0) null;

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
    }

    drawBoard()
    {
        if (!this.ClearCanvas()) return;

        for (let i = 0; i < this._height; i++) {
            for (let j = 0; j < this._width; j++) {
                let x = j * this._squareWidth;
                let y = i * this._squareWidth;

                if ((i+j) % 2) {
                    this.DrawSquare(x, y, this._darkSquareColor);
                } else {
                    this.DrawSquare(x, y, this._lightSquareColor);
                }

                let piece = this._squares[i][j].getPiece();
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
    }



    ClearCanvas()
    {
        if (!this._ctx) return false;
        if (!this._canvas) return false;
        this._ctx.clearRect(0,0,this._canvas.width, this._canvas.height);
        return true;
    }

    DrawSquare(x: number, y:number, color:string)
    {
        if (!this._ctx) return;
        this._ctx.fillStyle = color;
        this._ctx.fillRect(x, y, this._squareWidth, this._squareWidth);
    }

    DrawKingImage(x: number, y: number, white: boolean)
    {
        if (!this._ctx || !this._image) return;
        this._ctx.drawImage(this._image, 0, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    }

    DrawQueenImage(x: number, y: number, white: boolean)
    {
        if (!this._ctx || !this._image) return;
        this._ctx.drawImage(this._image, 133, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    }

    DrawBishopImage(x: number, y: number, white: boolean)
    {
        if (!this._ctx || !this._image) return;
        this._ctx.drawImage(this._image, 266, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    }

    DrawKnightImage(x: number, y: number, white: boolean)
    {
        if (!this._ctx || !this._image) return;
        this._ctx.drawImage(this._image, 399, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    }

    DrawCastleImage(x: number, y: number, white: boolean)
    {
        if (!this._ctx || !this._image) return;
        this._ctx.drawImage(this._image, 532, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    }

    DrawPawnImage(x: number, y: number, white: boolean)
    {
        if (!this._ctx || !this._image) return;
        this._ctx.drawImage(this._image, 665, (white) ? 0 : 133, 133, 133, x, y, this._squareWidth, this._squareWidth);
    }
}

const canvas = document.getElementById("board")! as HTMLCanvasElement;
const fen = document.getElementById("fen")! as HTMLInputElement;
const button = document.querySelector("button");

let chessBoard = new ChessBoard();

let ChessPiecesImage = new Image();
ChessPiecesImage.src = "./ChessPieces.png";
ChessPiecesImage.onload = () => {
    chessBoard.Init(canvas, ChessPiecesImage);
}

button?.addEventListener("click", () => {
    chessBoard.LoadBoard(fen.value);
});
