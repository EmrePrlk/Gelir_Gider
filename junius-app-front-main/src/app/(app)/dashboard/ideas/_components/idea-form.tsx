'use client';

import { LoadingButton } from '@mui/lab';
import { Stack, MenuItem } from '@mui/material';

import { Industry } from 'src/definitions';
import UploadFile from 'src/app/(app)/_components/upload-file';

import Iconify from 'src/components/iconify';
import { RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';

import IdeaFormSection from './idea-form-section';

interface IdeaFormProps {
  submitting: boolean;
}

export default function IdeaForm({ submitting: isSubmitting }: IdeaFormProps) {
  return (
    <Stack spacing={6}>
      {/* Title */}
      <IdeaFormSection
        title="Idea Title"
        description="Craft a compelling title that captures the essence of your innovation. Remember, this is your idea's first impression – make it count! A great title should be concise, memorable, and give investors a glimpse of your vision. Think of it as the headline that will make them want to read more."
      >
        <RHFTextField name="title" />
      </IdeaFormSection>

      {/* Short Description */}
      <IdeaFormSection
        title="Summary"
        description="Here's your chance to hook potential investors with a powerful elevator pitch. In just a few sentences, paint a vivid picture of your idea's potential. What problem does it solve? How is it unique? Why should anyone care? Your summary should be clear, concise, and compelling enough to make readers eager to learn more. Think of it as the trailer for your idea's blockbuster story."
      >
        <RHFTextField name="summary" />
      </IdeaFormSection>

      {/* Industry // TODO: Make it searchable */}
      <IdeaFormSection
        title="Industry"
        description="Choosing the right industry is crucial for positioning your idea. It helps investors understand your market and potential impact. While your innovation might span multiple sectors, select the one where it will make the biggest splash. This choice will influence everything from your target audience to your competition, so choose wisely. Remember, sometimes the most groundbreaking ideas come from applying solutions from one industry to another!"
      >
        <RHFSelect name="category" label="Category">
          {Object.entries(Industry).map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {value}
            </MenuItem>
          ))}
        </RHFSelect>
      </IdeaFormSection>

      {/* Target Investment */}
      <IdeaFormSection
        title="Target Investment"
        description="Be bold but realistic when setting your investment target. This figure should reflect a deep understanding of your idea's potential and the resources needed to bring it to life. Consider all aspects: development costs, marketing, team building, and scaling. Remember, investors aren't just buying into your idea; they're investing in its future growth. Justify your ask with solid projections and a clear vision for how you'll use the funds to create value."
      >
        <RHFTextField
          name="target_investment"
          type="number"
          InputProps={{
            startAdornment: <Iconify icon="mdi:currency-usd" sx={{ mr: 1 }} />,
          }}
        />
      </IdeaFormSection>

      {/* Possible Competitor */}
      <IdeaFormSection
        title="Possible Competitors"
        description="Knowing your competition is a sign of a savvy entrepreneur. Don't be afraid to acknowledge strong competitors – it shows you've done your homework. Identify both direct and indirect competitors, and be prepared to explain how your idea stands out. Remember, a crowded market isn't always bad; it can validate the need for your solution. Your goal is to demonstrate how you'll carve out your unique space in the industry landscape."
      >
        <RHFTextField name="possible_competitor" />
      </IdeaFormSection>

      {/* Detail */}
      {/* TODO: Implement file upload to the editor, its simple REACT-QUILL */}
      <IdeaFormSection
        title="Detailed Description"
        description="This is where you dive deep into your idea's brilliance. Paint a comprehensive picture of how your innovation works, its key features, and the problems it solves. Don't just focus on the 'what' – explain the 'why' and 'how'. Share your passion and vision, but back it up with facts, research, and logical reasoning. Address potential challenges and how you plan to overcome them. Remember, this is your chance to showcase your expertise and prove that you've thought through every aspect of your idea."
      >
        <RHFEditor name="detail" />
      </IdeaFormSection>

      {/* Files */}
      <IdeaFormSection
        title="Supporting Documents"
        description="Bring your idea to life with compelling visuals and detailed documentation. This is your opportunity to showcase prototypes, mockups, market research, financial projections, or any other materials that strengthen your case. Quality trumps quantity – each document should add significant value to your presentation. Consider including a pitch deck, technical specifications, or user testimonials if available. Remember, these files could be the deciding factor that turns an interested investor into a committed partner."
      >
        <UploadFile
          name="document_link"
          label=""
          isSubmitting={isSubmitting}
          helperText="Allowed *.pdf, *.doc, *.docx, *.xls, *.xlsx, *.jpg, *.png"
          multiple
          maxCount={5}
          accept={{
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
              ['.xlsx'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
              ['.docx'],
            'image/jpeg': ['.jpg'],
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
          }}
        />
      </IdeaFormSection>
      <Stack direction="row" justifyContent="flex-end">
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          startIcon={<Iconify icon="mdi:rocket-launch" />}
          sx={{ p: 2 }}
        >
          Submit Your Vision
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
