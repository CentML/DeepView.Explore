
import Subheader from './Subheader';

export default function ProjectInfo({projectRoot, entryPoint}) {
    return (
        <div className="innpv-memory innpv-subpanel">
            {/* <Subheader icon="database">Project Info</Subheader> */}
            <div className="innpv-subpanel-content">
                <table>
                    <tr><td>Project Root</td> <td><code>{projectRoot}</code></td></tr>
                    <tr><td>Entry Point</td> <td><code>{entryPoint}</code></td></tr>
                </table>
            </div>
        </div>
    );
}