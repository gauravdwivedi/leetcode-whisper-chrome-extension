import { z } from 'zod'
import { ValidModal } from '@/constants/valid_modals'
import { modals } from '@/modals'
import { ModalInterface } from '@/interface/ModalInterface'
import { outputSchema } from '@/schema/modeOutput'
import { ProviderMetadata } from 'ai'

export class ModalService {
  private activeModal: ModalInterface | null = null

  selectModal(modalName: ValidModal, apiKey?: string) {
    if (modals[modalName]) {
      this.activeModal = modals[modalName]
      this.activeModal.init(apiKey)
    } else {
      throw new Error(`Modal "${modalName}" not found`)
    }
  }

  async generate(
    prompt: string,
    systemPrompt: string
  ): Promise<
    Promise<{
      error: Error | null
      success: z.infer<typeof outputSchema> | null
    }>
  > {
    if (!this.activeModal) {
      throw new Error('No modal selected')
    }
    return this.activeModal.generateResponse(prompt, systemPrompt)
  }
}
