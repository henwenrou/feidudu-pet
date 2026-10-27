#!/usr/bin/env python3
"""Install the already-validated package; requires only Python's standard library."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import struct
import tempfile

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_SHA256 = '7a83959d03f4a7c514920a5f90dfe9dc68c9251bd536bace71750bd170af8c17'

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Verify package integrity without installing')
    parser.add_argument('--pets-dir', type=Path, help='Override destination for a portable installation')
    args = parser.parse_args()
    source = ROOT / 'codex/feidudu-strawhat-mac'
    manifest = json.loads((source/'pet.json').read_text(encoding='utf-8'))
    assert manifest['id'] == 'feidudu-strawhat-mac'
    assert manifest['spriteVersionNumber'] == 2
    assert manifest['spritesheetPath'] == 'spritesheet.png'
    data = (source/'spritesheet.png').read_bytes()
    if hashlib.sha256(data).hexdigest() != EXPECTED_SHA256:
        raise SystemExit('Package checksum mismatch. Download the original validated release again.')
    if data[:8] != b'\x89PNG\r\n\x1a\n' or struct.unpack('>II', data[16:24]) != (1536,2288):
        raise SystemExit('Invalid v2 PNG package.')
    if args.check:
        print('OK: package bytes match the validated 73-frame v2 release.')
        return
    codex_home = Path(os.environ.get('CODEX_HOME') or Path.home()/'.codex')
    pets_dir = args.pets_dir or codex_home/'pets'
    pets_dir.mkdir(parents=True,exist_ok=True)
    target = pets_dir/manifest['id']
    if target.exists():
        current = target/'spritesheet.png'
        if current.is_file() and hashlib.sha256(current.read_bytes()).hexdigest() == EXPECTED_SHA256 and (target/'pet.json').is_file() and json.loads((target/'pet.json').read_text()) == manifest:
            print(f'Already installed: {target}')
            print('Codex: Settings → Pets → Refresh → 草帽火尾肥嘟嘟; then /pet')
            return
        backup = Path(tempfile.mkdtemp(prefix='feidudu-backup-',dir=pets_dir))
        shutil.copytree(target,backup/'previous',dirs_exist_ok=True)
        print(f'Previous version backed up: {backup}')
    target.mkdir(exist_ok=True)
    # Write the image first; publish the manifest only after the asset is present.
    shutil.copy2(source/'spritesheet.png',target/'spritesheet.png')
    shutil.copy2(source/'pet.json',target/'pet.json')
    print(f'Installed: {target}')
    print('Codex: Settings → Pets → Refresh → 草帽火尾肥嘟嘟; then /pet')

if __name__ == '__main__':
    main()
