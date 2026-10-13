import threading
import webbrowser
from flask import Flask, jsonify, render_template, request
import fisica

app = Flask(__name__)


def num(d, k):
    try:
        return float(d[k])
    except (KeyError, TypeError, ValueError):
        raise ValueError(f"Valor inválido en '{k}'")


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/capacitancia")
def api_capacitancia():
    try:
        d = request.get_json(force=True)
        A, dist, k = num(d, "A_cm2") * 1e-4, num(d, "d_mm") * 1e-3, num(d, "kappa")
        C0, C = fisica.capacitancia(A, dist), fisica.capacitancia(A, dist, k)
        return jsonify(C=C, C0=C0, factor=k, Q12=C * 12)
    except (ValueError, AttributeError) as e:
        return jsonify(error=str(e)), 400


@app.post("/api/energia")
def api_energia():
    try:
        d = request.get_json(force=True)
        C, V = num(d, "C"), num(d, "V")
        Q, U1, U2, U3 = fisica.energia(C, V)
        Vmax, vs, us = fisica.curva_energia(C, V)
        return jsonify(Q=Q, U1=U1, U2=U2, U3=U3, U_doble=fisica.energia(C, 2 * V)[1], Vmax=Vmax, curva={"V": vs, "U": us})
    except (ValueError, AttributeError) as e:
        return jsonify(error=str(e)), 400


if __name__ == "__main__":
    PUERTO = 5001
    threading.Timer(1.0, lambda: webbrowser.open(f"http://127.0.0.1:{PUERTO}")).start()
    app.run(host="127.0.0.1", port=PUERTO, debug=False)
