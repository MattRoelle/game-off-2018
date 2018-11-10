precision mediump float;

uniform sampler2D uMainSampler;
uniform sampler2D uWallSampler;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 outTexCoord;
varying vec4 outTint;

const float foam_distance = 0.004;
const float color_rounding = 8.0;

float blendLighten(float base, float blend) {
	return min(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}


vec4 blur13(sampler2D image, vec2 uv, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / uResolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / uResolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / uResolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / uResolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / uResolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / uResolution)) * 0.010381362401148057;
  return color;
}

vec4 blur(sampler2D image, vec2 uv) {
    return (blur13(image, uv, vec2(1.0, 1.0)) + blur13(image, uv, vec2(-1.0, 1.0)))/2.0;
}

void main() {
    // water wavy effect
    float t = uTime*0.00125;
    float sint = sin(t);
    float cost = sin(t);
    vec2 offset = vec2(sint*0.3*sin(outTexCoord.x+t))*1.225;
    offset.y += t*0.85;
    offset.x += t*0.35;
    vec2 vc = outTexCoord + vec2(offset.x*0.5, offset.y);
    
    vec4 water_col = texture2D(uMainSampler, vc);
    vec4 light_col = vec4(1.0 - vec3(sin(offset.x*5.0)*0.5), 1.0);
    vec4 avg_col = (water_col + water_col + water_col + light_col)/4.0;
    vec4 col = vec4(water_col.r, (water_col.g + avg_col.g) / 2.0, water_col.b, 1.0);


    // find wall edges
    vec2 wall_tc = outTexCoord/(uResolution/40.0);
    float adjacent_wall_alpha = 
        (blur(uWallSampler, wall_tc + vec2(0.0, foam_distance)).a +
        blur(uWallSampler, wall_tc + vec2(0.0, -foam_distance)).a +
        blur(uWallSampler, wall_tc + vec2(foam_distance, 0.0)).a +
        blur(uWallSampler, wall_tc + vec2(-foam_distance, 0.0)).a +
        blur(uWallSampler, wall_tc + vec2(foam_distance, foam_distance)).a +
        blur(uWallSampler, wall_tc + vec2(-foam_distance, foam_distance)).a +
        blur(uWallSampler, wall_tc + vec2(-foam_distance, -foam_distance)).a +
        blur(uWallSampler, wall_tc + vec2(foam_distance, -foam_distance)).a)/8.0;
        
    if (adjacent_wall_alpha > 0.0) {
        vec4 foam_col = vec4(vec3(blendLighten(col.rgb, vec3(0.0, 0.0, 0.0), adjacent_wall_alpha)), 1.0);
        gl_FragColor = foam_col;
    } else {
        gl_FragColor = col;
    }
    //gl_FragColor = texture2D(uWallSampler, wall_tc);
    //gl_FragColor = blur(uWallSampler, wall_tc);

    gl_FragColor = vec4(
        floor(gl_FragColor.r*color_rounding)/color_rounding,
        floor(gl_FragColor.g*color_rounding)/color_rounding,
        floor(gl_FragColor.b*color_rounding)/color_rounding,
        1.0
    );
}

