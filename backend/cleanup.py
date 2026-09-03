import subprocess
import os

def cleanup_port():
    try:
        raw = subprocess.check_output('netstat -ano', shell=True)
        try:
            lines = raw.decode('cp949', errors='ignore').splitlines()
        except Exception:
            lines = raw.decode('utf-8', errors='ignore').splitlines()

        for line in lines:
            if ':8000' in line and 'LISTENING' in line:
                parts = line.strip().split()
                pid = parts[-1]
                if pid != '0' and pid != str(os.getpid()):
                    os.system(f'taskkill /F /PID {pid} >nul 2>&1')
                    print(f'[안내] 포트 8000 점유 프로세스(PID: {pid})를 정리했습니다.')
    except Exception:
        pass

if __name__ == '__main__':
    cleanup_port()
