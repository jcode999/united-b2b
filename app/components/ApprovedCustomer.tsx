import { Banner,Thumbnail } from "@shopify/polaris"


interface ApprovedCustomerProps{
    erplyCustomerId:string,
    shopifyCustomerId:string,
}
const ApprovedCustomer = ({erplyCustomerId,shopifyCustomerId}:ApprovedCustomerProps) =>{
    
    return(
        <>
        
        <Banner
                        title="Customer has been approved"
                        tone="success"
                        // onDismiss={() => { setShowBanner(false) }}
                    >
                        
                        
                        <p>View customer accounts</p>
                        <div style={{'display':'flex','gap':'5em','margin':'1em 0'}}>
                            <div >
                                
                                <a href={shopifyCustomerId} target="__blank" rel="noopener noreferrer">
                                <Thumbnail
                                    source="https://cdn.shopify.com/s/files/1/0708/5627/8266/files/shopify-outline-bag-icon-symbol-logo-701751695132535ezprftihub.png?v=1741338038"
                                    alt="Black choker necklace"
                                    
                                />
                                </a>
                                
                                
                            </div>
                            <div>
                            <a href={erplyCustomerId} target="__blank" rel="noopener noreferrer">
                                <Thumbnail
                                    source="https://cdn.shopify.com/s/files/1/0708/5627/8266/files/erply-icon-unplated.png?v=1741338110"
                                    alt="Black choker necklace"
                                />
                            </a>
                            </div>
                        </div>
                        
        
        </Banner>
        </>
    )
}
export default ApprovedCustomer