"""Núcleo físico de la Unidad 2: capacitores de placas paralelas y energía almacenada."""
import numpy as np

EPS0 = 8.854e-12   # F/m

DIELECTRICOS = {"Vacío": 1.0, "Aire": 1.0006, "Teflón": 2.1, "Papel": 3.7, "Vidrio": 5.0, "Mica": 6.0, "Agua": 80.0}


def capacitancia(A_m2, d_m, kappa=1.0):
    """C = κ·ε0·A/d  (placas paralelas, sin efectos de borde)."""
    if A_m2 <= 0 or d_m <= 0 or kappa < 1:
        raise ValueError("A y d deben ser positivos y κ ≥ 1")
    return kappa * EPS0 * A_m2 / d_m


def energia(C, V):
    """Q y la energía U calculada de tres formas equivalentes."""
    if C <= 0:
        raise ValueError("C debe ser mayor que 0")
    Q = C * V
    return Q, 0.5 * C * V ** 2, 0.5 * Q * V, Q ** 2 / (2 * C)


def curva_energia(C, V, n=80):
    """Puntos de U = ½CV² desde 0 hasta 2·|V| (mínimo 1 V)."""
    Vmax = max(2 * abs(V), 1.0)
    v = np.linspace(0, Vmax, n)
    return Vmax, v.tolist(), (0.5 * C * v ** 2).tolist()
