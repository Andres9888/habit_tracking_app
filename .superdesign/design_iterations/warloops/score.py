#!/usr/bin/env python3
# WAR LOOPS fidelity scorer — SSIM (box-window via integral images), MAE, per-band SSIM, diff heatmap.
import sys, json, numpy as np
from PIL import Image

def load(p):
    return np.asarray(Image.open(p).convert('RGB'), dtype=np.float64)

def gray(a):
    return a @ np.array([0.299, 0.587, 0.114])

def integral(x):
    return np.pad(np.cumsum(np.cumsum(x, 0), 1), ((1,0),(1,0)))

def box_mean(x, w):
    I = integral(x); H, W = x.shape
    r = w // 2
    out = np.zeros_like(x)
    ys = np.arange(H); xs = np.arange(W)
    y0 = np.clip(ys - r, 0, H); y1 = np.clip(ys + r + 1, 0, H)
    x0 = np.clip(xs - r, 0, W); x1 = np.clip(xs + r + 1, 0, W)
    cnt = (y1 - y0)[:,None] * (x1 - x0)[None,:]
    A = I[np.ix_(y1, x1)]; B = I[np.ix_(y0, x0)]
    C = I[np.ix_(y0, x1)]; D = I[np.ix_(y1, x0)]
    return (A + B - C - D) / cnt

def ssim_map(a, b, w=11):
    C1 = (0.01*255)**2; C2 = (0.03*255)**2
    mu_a = box_mean(a, w); mu_b = box_mean(b, w)
    mu_a2 = mu_a*mu_a; mu_b2 = mu_b*mu_b; mu_ab = mu_a*mu_b
    va = box_mean(a*a, w) - mu_a2
    vb = box_mean(b*b, w) - mu_b2
    vab = box_mean(a*b, w) - mu_ab
    s = ((2*mu_ab + C1)*(2*vab + C2)) / ((mu_a2 + mu_b2 + C1)*(va + vb + C2))
    return s

def score(pa, pb, heat_out=None, bands=8):
    a = load(pa); b = load(pb)
    if a.shape != b.shape:
        h = min(a.shape[0], b.shape[0]); w = min(a.shape[1], b.shape[1])
        a = a[:h,:w]; b = b[:h,:w]
    ga, gb = gray(a), gray(b)
    smap = ssim_map(ga, gb)
    full = float(smap.mean())
    mae = float(np.abs(a - b).mean())
    # per-horizontal-band SSIM (to localize the weakest region)
    H = smap.shape[0]; edges = np.linspace(0, H, bands+1).astype(int)
    band_ssim = [round(float(smap[edges[i]:edges[i+1]].mean()), 4) for i in range(bands)]
    if heat_out:
        d = np.abs(a - b).mean(2)
        d = np.clip(d / max(d.max(), 1e-6) * 255, 0, 255).astype(np.uint8)
        Image.fromarray(d).save(heat_out)
    return {"a": pa.split('/')[-1], "b": pb.split('/')[-1],
            "ssim": round(full, 4), "mae": round(mae, 2),
            "band_ssim": band_ssim,
            "weakest_band": int(np.argmin(band_ssim)), "weakest_band_ssim": min(band_ssim)}

if __name__ == "__main__":
    pairs = json.loads(sys.argv[1])
    out = [score(p["a"], p["b"], p.get("heat")) for p in pairs]
    print(json.dumps(out, indent=2))
