import {

    Page,
    Icon,
    Combobox,
    Card,
    ResourceList,
    ResourceItem,
    Text,
    Avatar,
    CalloutCard,
    Button,
    Banner,
    Scrollable,

} from "@shopify/polaris";

import { useEffect, useState } from "react";
import { useFetcher, useActionData } from "@remix-run/react";
import { SearchIcon } from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import { searchCustomerByName, updateMetaFields, updateMetaFieldsList } from "../shopifyServices/cutomer";
import { json } from "@remix-run/node";
// import type {ResourceListProps} from '@shopify/polaris';
// function formatList(strings) {
//     return `"[${strings.map(s => "${s}").join(',')}]"`;
// }
export async function action({ request, params }) {
    const formData = await request.formData()
    console.log("form data: ", formData.get("customer_name"))

    const { admin } = await authenticate.admin(request);
    if (formData.get('do') === 'search') {
        const customers = await searchCustomerByName(formData.get("customer_name"), admin.graphql)
        console.log("inaction: ", customers)
        return json({
            'customers': customers,
            'type': 'search'
        })
    }
    console.log("other form data")
    console.log(formData.get("customers"))

    const handles = formData.getAll("products")[0].split(",")

    console.log(handles)
    // const stringHandles = formatList(["foo","bar"])

    const result = await updateMetaFieldsList(admin.graphql, formData.get("customers"), JSON.stringify(handles))
    return json({
        'result': result,
        'type': 'updateCustomerMetafield'
    })
}

const ProductRecommendation = () => {
    const [fetchedCustomers, setFetchedCustomers] = useState(null)
    const [customerQuery, setCustomerQuery] = useState('')
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [recomendationStatus, setRecommendationStatus] = useState('')
    const fetcher = useFetcher();
    const fetcherData = fetcher.data
    // const actionData = useActionData()

    useEffect(() => {
        console.log("fetched data: ", fetcherData)
        if (fetcherData?.customers) {

            console.log("useEffect: ", fetcherData)
            setFetchedCustomers(fetcherData['customers'])
        }
        if (fetcherData?.['type'] === "updateCustomerMetafield") {
            if (fetcherData['result'])
                setRecommendationStatus("OK")
        }
    }, [fetcherData])



    // useEffect(() => {
    //     console.log("action data: ", fe)

    // }, [actionData])



    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        fetcher.submit(
            { customer_name: customerQuery, do: 'search' }, // Pass query data to the form submission
            { method: 'post' }
        );
    };

    const handleAddMetas = () => {

        const handles = selectedProducts.map((prod) => (prod['handle']))
        console.log("---->", handles)
        fetcher.submit(
            {
                products: handles,
                customers: selectedItems,
                do: 'meta'
            }, // Pass query data to the form submission
            { method: 'post' }
        );
    }
    async function selectProduct() {
        console.log("selecting product.")
        const products = await window.shopify.resourcePicker({
            type: "product",
            action: "select",
            multiple: true, // customized action verb, either 'select' or 'add',
        });

        if (products) {
            // const { images, id, variants, title, handle } = products[0];
            setSelectedProducts([...selectedProducts, ...products])
        }
    }
    return (<>

        <Page>
        {
                recomendationStatus === 'OK' && <Banner tone="success"
                    title="Successfully Added Product Recomendations">
                    <p>You may manage where these product appear on customers page using the theme editor.</p>

                </Banner>
            }
            <div style={{ 'margin': '1em 0' }}>
                <form
                    onSubmit={handleSearchSubmit}

                >
                    <Combobox
                        activator={
                            <Combobox.TextField
                                prefix={<Icon source={SearchIcon} />}
                                onChange={setCustomerQuery}
                                label="Search tags"
                                labelHidden
                                value={customerQuery}
                                placeholder="Search Customer"
                                autoComplete="off"
                                name="customer_name"
                            />
                        }

                    ></Combobox>
                    <button type="submit" style={{ 'display': 'none' }}></button>
                </form>
            </div>
            {fetchedCustomers &&

                <Card>


                    <ResourceList
                        resourceName={resourceName}
                        items={fetchedCustomers}
                        renderItem={renderItem}
                        selectedItems={selectedItems}
                        onSelectionChange={setSelectedItems}
                        //   filterControl={filterControl}
                        selectable

                    />
                </Card>

            }
            {selectedItems.length > 0 &&
                <div style={{'margin':'2em 0'}}>
                    <Card>
                        <div style={{'margin':'1em 0'}}>
                            <Text fontWeight="bold">Add products to recommend to this customer</Text>
                        </div>
                        
                        {/* <CalloutCard
                            title="Add products to recommend to this customer(s)"
                            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                            primaryAction={{}}
                        > */}
                            {/* <p>Upload your store’s logo, change colors and fonts, and more.</p> */}
                            <Button onClick={selectProduct}>Select Product</Button>
                        {/* </CalloutCard> */}
                    </Card>
                </div>
            }

            {
                selectedProducts.length > 0 && <Card>
                    <h4>Selected Products</h4>
                    <Scrollable>
                    <ResourceList
                        resourceName={{
                            singular: 'product',
                            plural: 'Products',
                        }}
                        items={selectedProducts}
                        renderItem={renderSelectedProducts}
                    >

                    </ResourceList>
                    <Button onClick={handleAddMetas}>Apply</Button>
                    </Scrollable>
                </Card>
            }
            
        </Page>
    </>
    )
    function renderItem(item) {
        const { id, firstName, lastName, addresses } = item;
        const media = <Avatar customer size="md" name={name} />;

        return (
            <ResourceItem id={id} url={''} media={media}>

                <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {firstName}, {lastName}
                </Text>
                <div>{addresses[0]['company']}</div>
            </ResourceItem>
        );
    }
    function renderSelectedProducts(item) {
        const { images, id, variants, title, handle } = item
        const media = <Avatar customer size="md" name={title} />;

        return (
            <ResourceItem id={id} url={''} media={media}>

                <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {title}
                </Text>
                <div>{handle}</div>

            </ResourceItem>
        );
    }

}
export default ProductRecommendation