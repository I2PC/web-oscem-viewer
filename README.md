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
   ```
   For example:
   ```bash
   streamlit run viewer-cryoem-cnb.py -- -d data/Processing_metadata.yaml
   ```
   ***Note***: *if you are including image paths in the metadata yaml file, you should define them with respect to the viewer-cryoem-cnb.py or in absolute path.*

   
4. Your default browser should automatically open the application. If not, you can access it manually at http://localhost:8501.
