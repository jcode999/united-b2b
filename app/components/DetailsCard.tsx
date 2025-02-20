import { Card } from "@shopify/polaris"
interface DetailsCardProps {
    heading: string,
    labels: string[],
    data: string[],
}
const DetailsCard = ({ heading, labels, data }: DetailsCardProps) => {
    <Card>
        <div className="detail-heading">
            <h4 style={{ 'fontWeight': 'bold' }}>{}</h4>
        </div>

        <div >
            {
                labels.map((label,index)=>(
                    <div key={index} className="detail-group">
                        <span className="detail-label">{}</span>
                        <span className="details-data">{}</span>
                    </div>
                ))
            }
        </div>


    </Card>
}
export default DetailsCard