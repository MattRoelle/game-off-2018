precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;

varying vec2 outTexCoord;
varying vec4 outTint;

void main() {
    vec4 col = texture2D(uMainSampler, outTexCoord);
    float sint = sin(uTime*0.1);
    if (col.a > 0.0 && sint > 0.0) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {

    }
}

