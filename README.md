# **web-oscem-viewer**
A web-based viewer for Cryo-EM processing workflow metadata in YAML format.

---

## **Demo Instructions**

To run the demo:

1. Install the required dependency:
   ```bash
   pip install streamlit pyyaml
2. Launch the viewer, specifying the folder containing the metadata:
   ```bash
   streamlit run viewer-cryoem-cnb.py -- -d /path/to/your/metadata
3. Your default browser should automatically open the application. If not, you can access it manually at http://localhost:8501.