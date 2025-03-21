import {

    Card,
    ResourceList,
    Avatar,
    ResourceItem,
    Text,
    
    Icon,
    Combobox
} from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
import {  useFetcher} from "@remix-run/react";


export default function SearchCustomer() {
    const fetcher = useFetcher();
    // const [taggedWith, setTaggedWith] = useState<string | undefined>('VIP');
    const [queryValue, setQueryValue] = useState<string | undefined>(undefined);

    const handleSubmit = ()=>{

    }
    // const handleTaggedWithChange = useCallback(
    //   (value: any) => setTaggedWith(value),
    //   [],
    // );
    // const handleTaggedWithRemove = useCallback(
    //   () => setTaggedWith(undefined),
    //   [],
    // );
    // const handleQueryValueRemove = useCallback(
    //   () => setQueryValue(undefined),
    //   [],
    // );
    // const handleClearAll = useCallback(() => {
    //   handleTaggedWithRemove();
    //   handleQueryValueRemove();
    // }, [handleQueryValueRemove, handleTaggedWithRemove]);

    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };

    const items = [
        {
            id: '108',
            url: '#',
            name: 'Mae Jemison',
            location: 'Decatur, USA',
        },
        {
            id: '208',
            url: '#',
            name: 'Ellen Ochoa',
            location: 'Los Angeles, USA',
        },
    ];

    // const filters = [
    //   {
    //     key: 'taggedWith1',
    //     label: 'Tagged with',
    //     filter: (
    //       <TextField
    //         label="Tagged with"
    //         value={taggedWith}
    //         onChange={handleTaggedWithChange}
    //         autoComplete="off"
    //         labelHidden
    //       />
    //     ),
    //     shortcut: true,
    //   },
    // ];

    // const appliedFilters =
    //   taggedWith && !isEmpty(taggedWith)
    //     ? [
    //         {
    //           key: 'taggedWith1',
    //           label: disambiguateLabel('taggedWith1', taggedWith),
    //           onRemove: handleTaggedWithRemove,
    //         },
    //       ]
    //     : [];

    // const filterControl = (
    //   <Filters
    //     queryValue={queryValue}
    //     filters={filters}
    //     appliedFilters={appliedFilters}
    //     onQueryChange={setQueryValue}
    //     onQueryClear={handleQueryValueRemove}
    //     onClearAll={handleClearAll}
    //   >
    //     <div style={{paddingLeft: '8px'}}>
    //       <Button onClick={() => console.log('New filter saved')}>Save</Button>
    //     </div>
    //   </Filters>
    // );

    return (
        <Card>
            

            <ResourceList
                resourceName={resourceName}
                items={items}
                renderItem={renderItem}
            //   filterControl={filterControl}
            />
        </Card>
    );

    function renderItem(item: typeof items[number]) {
        const { id, url, name, location } = item;
        const media = <Avatar customer size="md" name={name} />;

        return (
            <ResourceItem id={id} url={url} media={media}>
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {name}
                </Text>
                <div>{location}</div>
            </ResourceItem>
        );
    }

    // function disambiguateLabel(key: string, value: string): string {
    //   switch (key) {
    //     case 'taggedWith1':
    //       return `Tagged with ${value}`;
    //     default:
    //       return value;
    //   }
    // }

    // function isEmpty(value: string): boolean {
    //   if (Array.isArray(value)) {
    //     return value.length === 0;
    //   } else {
    //     return value === '' || value == null;
    //   }
    // }
}