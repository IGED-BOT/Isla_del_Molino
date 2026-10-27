export default `#version 300 es
precision highp float;

in vec3 vDir;

uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uNadir;
uniform vec3 uSunDirection;
uniform vec3 uMoonDirection;
uniform float uSunSize;
uniform float uMoonSize;
uniform sampler2D uStarMap;
uniform int uUseStarMap;

out vec4 outColor;

// ── Proyección equirectangular: dirección 3D → UV [0,1]×[0,1] ────────────────
vec2 sphereToEq(vec3 d) {
    const float PI = 3.14159265359;
    float phi   = atan(d.z, d.x);                    // azimut  [-π, π]
    float theta = asin(clamp(d.y, -1.0, 1.0));       // elevación [-π/2, π/2]
    return vec2(phi / (2.0 * PI) + 0.5,
                theta / PI + 0.5);
}

// Rotación alrededor del eje Y
vec3 rotY(vec3 d, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c*d.x - s*d.z, d.y, s*d.x + c*d.z);
}

// ── Muestreo directo de la imagen del cielo estrellado ───────────────────────
// 4 muestras rotadas 90° en azimut, ponderadas por distancia a la costura U.
// Devuelve el color de la imagen distribuida sin costuras sobre el domo.
vec3 sampleStarMap(vec3 dir) {
    const float PI = 3.14159265359;
    vec3  colSum = vec3(0.0);
    float wSum   = 0.0;

    float angles[4];
    angles[0] = 0.0;
    angles[1] = PI * 0.5;
    angles[2] = PI;
    angles[3] = PI * 1.5;

    for (int i = 0; i < 4; i++) {
        vec3  rd  = rotY(dir, angles[i]);
        vec2  uv  = sphereToEq(rd);
        // Peso: 0 en costura (u≈0 o u≈1), máximo en el centro (u=0.5)
        float w   = smoothstep(0.0, 0.3, min(uv.x, 1.0 - uv.x) * 2.0);
        vec3  col = texture(uStarMap, uv).rgb;
        colSum   += col * w;
        wSum     += w;
    }
    return (wSum > 0.0) ? colSum / wSum : vec3(0.02, 0.04, 0.10);
}

void main() {
    vec3  dir = normalize(vDir);
    float h   = dir.y;

    // Color base del cielo (degradado zenith→horizonte→nadir)
    vec3 sky = mix(uHorizon, uZenith, smoothstep(-0.05, 0.65, h));
    sky = mix(uNadir, sky, smoothstep(-0.4, 0.05, h));

    // Halo y resplandor solar
    float sunDot  = max(dot(dir, normalize(uSunDirection)), 0.0);
    float sunFade = smoothstep(-0.06, 0.06, uSunDirection.y);
    float sunGlow = pow(sunDot, uSunSize) * sunFade;
    sky += vec3(1.0, 0.88, 0.5) * (sunGlow * 1.5);

    // Halo y resplandor lunar
    float moonDot  = max(dot(dir, normalize(uMoonDirection)), 0.0);
    float moonFade = smoothstep(-0.06, 0.06, uMoonDirection.y);
    float moonGlow = pow(moonDot, uMoonSize) * moonFade;
    sky += vec3(0.65, 0.80, 1.0) * (moonGlow * 0.85);

    // ── Cielo estrellado de noche ─────────────────────────────────────────────
    // nightFactor: 0 = día completo, 1 = noche completa
    float nightFactor = smoothstep(0.04, -0.14, uSunDirection.y);

    if (h > -0.01 && nightFactor > 0.001) {
        // Fade suave en el horizonte (evita estrellas sobre el mar)
        float horizFade = smoothstep(-0.01, 0.14, h);

        // Máscara para no solapar el halo solar (amanecer/atardecer)
        float sunDist = 1.0 - max(dot(dir, normalize(uSunDirection)), 0.0);
        float sunMask = smoothstep(0.015, 0.10, sunDist);

        // Máscara para no solapar el halo lunar
        float moonDist = 1.0 - max(dot(dir, normalize(uMoonDirection)), 0.0);
        float moonMask = smoothstep(0.006, 0.05, moonDist);

        float alpha = nightFactor * horizFade * sunMask * moonMask;

        if (alpha > 0.001) {
            vec3 starColor;
            if (uUseStarMap == 1) {
                // La imagen del cielo estrellado se usa directamente como fondo
                starColor = sampleStarMap(dir);
            } else {
                starColor = vec3(0.02, 0.04, 0.10); // oscuro sin textura
            }
            // Mezcla la imagen sobre el color base del cielo
            sky = mix(sky, starColor, alpha);
        }
    }

    outColor = vec4(sky, 1.0);
}
`;
