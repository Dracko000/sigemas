"""Build and render the SiGEMAS FigCraft design file."""
import subprocess

from generate_ui import B, CLI, OUT, RENDERS
from generate_ui import page_cover, page_foundations
from screens_a import page_student_home, page_catalog, page_reader
from screens_b import page_live_student, page_teacher_studio
from screens_c import page_teacher_home, page_parent, page_admin, page_auth
from screens_d import page_mobile


def main():
    page_cover()
    page_foundations()
    page_student_home()
    page_catalog()
    page_reader()
    page_live_student()
    page_teacher_studio()
    page_teacher_home()
    page_parent()
    page_admin()
    page_auth()
    page_mobile()
    out = B.finish()
    print(f"Wrote {out}")
    pages = [
        "00 — Cover",
        "01 — Foundations",
        "02 — Student home",
        "03 — Library",
        "04 — Reader",
        "05 — Live class",
        "06 — Teacher studio",
        "07 — Teacher home",
        "08 — Parent companion",
        "09 — Admin control",
        "10 — Sign in",
        "11 — Mobile flows",
    ]
    for page in pages:
        png = RENDERS / (page.replace(" — ", "_").replace(" ", "_") + ".png")
        subprocess.run([CLI, "render", str(out), "--page", page, "--out", str(png), "--scale", "1"], check=True)
        print("Rendered", png)


if __name__ == "__main__":
    main()
