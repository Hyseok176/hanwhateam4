import subprocess
import os

def stop_all_servers():
    killed = False
    try:
        raw = subprocess.check_output('netstat -ano', shell=True)
        try:
            lines = raw.decode('cp949', errors='ignore').splitlines()
        except Exception:
            lines = raw.decode('utf-8', errors='ignore').splitlines()

        for line in lines:
            if (':8000' in line or ':5173' in line) and 'LISTENING' in line:
                parts = line.strip().split()
                pid = parts[-1]
                if pid != '0' and pid != str(os.getpid()):
                    os.system(f'taskkill /F /PID {pid} >nul 2>&1')
                    print(f'[완료] 실행 중이던 서버 프로세스 (PID: {pid})를 정상 종료했습니다.')
                    killed = True
    except Exception as e:
        print(f'종료 중 오류: {e}')

    # cloudflared 터널 프로세스 정리
    os.system('taskkill /F /IM cloudflared.exe >nul 2>&1')

    if not killed:
        print('[안내] 현재 포트 8000 또는 5173에서 실행 중인 서버 프로세스가 없습니다.')

if __name__ == '__main__':
    stop_all_servers()
