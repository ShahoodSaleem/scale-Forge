const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');

console.log('Using ffmpeg path:', ffmpeg);
try {
  execSync(`${ffmpeg} -i public/Assets/Hero_Dark.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1280:-2" -movflags +faststart public/Assets/Hero_Dark_compressed.mp4`, { stdio: 'inherit' });
  console.log('Compression complete');
} catch (e) {
  console.error('Error during compression:', e.message);
}
