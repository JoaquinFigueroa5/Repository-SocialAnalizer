import { runScript } from '../utils/runScript.js';

export async function analyzeSocial(req, res) {
  const { username } = req.body;
  console.log(req.body);
  
  if (!username) return res.status(400).json({ error: 'Falta el nombre de usuario' });

  try {
    const output = await runScript('python', ['src/scripts/social_analyzer.py', username]);
    const result = JSON.parse(output);

    res.json(result);
    res.status(500).json({ success: true, message: 'Username accounts recovery'})
  } catch (err) {
    res.status(500).json({ error: 'Error ejecutando análisis', details: err });
  }
}
