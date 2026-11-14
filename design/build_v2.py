"""Build and render the friendly-clean SiGEMAS UI v2."""
import subprocess
from pathlib import Path

from generate_ui import B, CLI, RENDERS
from friendly_pages_a import (
    page_cover_v2,
    page_foundations_v2,
    page_student_home_v2,
    page_catalog_v2,
    page_reader_v2,
)
from friendly_pages_b import (
    page_live_student_v2,
    page_teacher_studio_v2,
    page_teacher_home_v2,
    page_parent_v2,
)
from friendly_pages_c import (
    page_admin_v2,
    page_auth_v2,
    page_mobile_v2,
)


def main():
    B.out_path = Path(r"C:\Users\USER\orca\projects\sibi\design\SIGEMAS-UI-v2-Friendly.figcraft")
    page_cover_v2()
    page_foundations_v2()
    page_student_home_v2()
    page_catalog_v2()
    page_reader_v2()
    page_live_student_v2()
    page_teacher_studio_v2()
    page_teacher_home_v2()
    page_parent_v2()
    page_admin_v2()
    page_auth_v2()
    page_mobile_v2()
    out = B.finish()
    print(f"Wrote {out}")
    pages = [
        "V2 00 — Cover",
        "V2 01 — Foundations",
        "V2 02 — Student home",
        "V2 03 — Library",
        "V2 04 — Reader",
        "V2 05 — Live class",
        "V2 06 — Teacher studio",
        "V2 07 — Teacher home",
        "V2 08 — Parent",
        "V2 09 — Admin",
        "V2 10 — Sign in",
        "V2 11 — Mobile",
    ]
    for page in pages:
        png = RENDERS / (page.replace(" — ", "_").replace(" ", "_") + ".png")
        subprocess.run([CLI, "render", str(out), "--page", page, "--out", str(png), "--scale", "1"], check=True)
        print("Rendered", png)


if __name__ == "__main__":
    main()
