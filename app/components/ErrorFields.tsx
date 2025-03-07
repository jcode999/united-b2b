import { Banner, FormLayout, TextField, Button } from "@shopify/polaris"
interface ErrorFieldProps {
    errorFields: any,
    form: any,
    handleFormChange: (field:string,value:any) => void,
    handleSubmit:()=>void,
}
const ErrorFields = ({ errorFields, form, handleFormChange, handleSubmit }: ErrorFieldProps) => {

    return (
        <div>
            <Banner
                title="Form has errors"
                tone="warning"
                onDismiss={() => { }}
            >
                <p>Please fix the following issues before approving the customer</p>
                <form>
                    <div style={{'margin':'2em 0 0 0'}}>
                    <FormLayout>
                        {
                            errorFields.map((error: any, index: number) => (
                                
                                <TextField
                                    key={index}
                                    label={error['field']}
                                    autoComplete="off"
                                    onChange={(value) => handleFormChange(error['field'],value)}
                                    value={form[error['field']]}
                                    name={form[error['field']]}
                                    helpText={<span style={{color:'red'}}>{error['error']}</span>}
                                ></TextField>
                                
                                
                            ))
                        }
                    </FormLayout>
                    </div>
                    <div style={{ 'margin': '2em 0 0 0' }}>
                        <Button 
                        variant="primary"
                        onClick={handleSubmit}>Save</Button>
                    </div>
                </form>

            </Banner>
        </div>
    )
}
export default ErrorFields