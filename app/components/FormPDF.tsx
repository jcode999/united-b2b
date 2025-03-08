import { pdf, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    marginBottom: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

interface TobaccoForm {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  validIdFileUrl: string;

  businessName: string;
  businessAddress1: string;
  businessAddress2?: string;
  businessCity: string;
  businessState: string;
  businessZip: string;

  ein: string;
  einFileUrl: string;
  salesAndUseTaxPermitNumber?: string;
  salesAndUseTaxFileUrl: string;

  tobaccoPermitNumber?: string;
  tobaccoPermitExpirationDate?: string;
  tobaccoPermitFileUrl?: string;

  approved?: boolean;
  shopifyAccountId?: string;
  erplyCustomerId?: number;
  erplyAddressId?: number;
}

const TobaccoFormPdf = ({ form }: { form: TobaccoForm }) => (
  <Document>
    {/* Form Data Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.label}>First Name:</Text>
        <Text style={styles.value}>{form.firstName}</Text>
        <Text style={styles.label}>Last Name:</Text>
        <Text style={styles.value}>{form.lastName}</Text>
        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{form.phoneNumber}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{form.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Business Name:</Text>
        <Text style={styles.value}>{form.businessName}</Text>
        <Text style={styles.label}>Business Address:</Text>
        <Text style={styles.value}>
          {form.businessAddress1}
          {form.businessAddress2 ? `, ${form.businessAddress2}` : ""}
        </Text>
        <Text style={styles.value}>
          {form.businessCity}, {form.businessState} {form.businessZip}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>EIN:</Text>
        <Text style={styles.value}>{form.ein}</Text>
        <Text style={styles.label}>Sales and Use Tax Permit Number:</Text>
        <Text style={styles.value}>{form.salesAndUseTaxPermitNumber || "N/A"}</Text>
        <Text style={styles.label}>Tobacco Permit Number:</Text>
        <Text style={styles.value}>{form.tobaccoPermitNumber || "N/A"}</Text>
        <Text style={styles.label}>Tobacco Permit Expiration Date:</Text>
        <Text style={styles.value}>
          {form.tobaccoPermitExpirationDate
            ? new Date(form.tobaccoPermitExpirationDate).toLocaleDateString()
            : "N/A"}
        </Text>
        <Text style={styles.label}>Approved:</Text>
        <Text style={styles.value}>{form.approved ? "Yes" : "No"}</Text>
      </View>
    </Page>

    {/* Image Pages */}
    {form.validIdFileUrl && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.label}>Valid ID:</Text>
        <Image src={form.validIdFileUrl} style={styles.image} />
      </Page>
    )}

    {form.einFileUrl && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.label}>EIN File:</Text>
        <Image src={form.einFileUrl} style={styles.image} />
      </Page>
    )}

    {form.salesAndUseTaxFileUrl && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.label}>Sales and Use Tax Permit:</Text>
        <Image src={form.salesAndUseTaxFileUrl} style={styles.image} />
      </Page>
    )}

    {form.tobaccoPermitFileUrl && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.label}>Tobacco Permit:</Text>
        <Image src={form.tobaccoPermitFileUrl} style={styles.image} />
      </Page>
    )}
  </Document>
);

export const generateTobaccoFormPdf = async (form: TobaccoForm) => {
    const blob = await pdf(<TobaccoFormPdf form={form} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TobaccoForm_${form.id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };


