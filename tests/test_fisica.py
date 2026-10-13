import os, sys, unittest
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import fisica


class PruebasUnidad2(unittest.TestCase):
    def test_placas_1m2_1mm(self):
        self.assertAlmostEqual(fisica.capacitancia(1, 1e-3) * 1e9, 8.854, places=3)

    def test_proporcionalidades(self):
        c = fisica.capacitancia(100e-4, 2e-3)
        self.assertAlmostEqual(fisica.capacitancia(200e-4, 2e-3) / c, 2.0, places=9)
        self.assertAlmostEqual(fisica.capacitancia(100e-4, 4e-3) / c, 0.5, places=9)
        self.assertAlmostEqual(fisica.capacitancia(100e-4, 2e-3, 5) / c, 5.0, places=9)

    def test_energia_tres_formulas(self):
        Q, u1, u2, u3 = fisica.energia(100e-9, 12)
        self.assertAlmostEqual(Q * 1e6, 1.2, places=9)
        self.assertAlmostEqual(u1 * 1e6, 7.2, places=9)
        self.assertAlmostEqual(u1, u2, places=15)
        self.assertAlmostEqual(u1, u3, places=15)

    def test_doble_voltaje_cuadruplica(self):
        self.assertAlmostEqual(fisica.energia(2.2e-6, 18)[1] / fisica.energia(2.2e-6, 9)[1], 4.0, places=9)

    def test_entradas_invalidas(self):
        with self.assertRaises(ValueError):
            fisica.capacitancia(0, 1e-3)
        with self.assertRaises(ValueError):
            fisica.energia(0, 5)


if __name__ == "__main__":
    unittest.main()
