import { IAIConfig, IAskInput } from '@interfaces/index.js'
import { BasePrompt, BaseUtil, ConfigUtil } from '@lib/index.js'
import { LLMChain, PromptTemplate } from 'langchain'
import { OpenAIEmbeddings } from 'langchain/embeddings'
import { OpenAI } from 'langchain/llms'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'

export class BrainUtil extends BaseUtil {
  private llmChain: LLMChain

  private constructor(private store: HNSWLib, config: IAIConfig) {
    super()

    this.logger.debug(`[BrainUtil#constructor] config: ${JSON.stringify(config, null, 2)}`)

    const llm = new OpenAI({
      temperature: config.openAiTemperature,
      openAIApiKey: config.openAIApiKey,
      modelName: config.openAIModelName,
    })

    const prompt = new PromptTemplate({
      template: BasePrompt,
      inputVariables: config.inputVariables,
    })

    this.llmChain = new LLMChain({ llm, prompt })
  }

  public static async init(): Promise<BrainUtil> {
    const config = ConfigUtil.getAIConfig()

    const store = await HNSWLib.load(
      config.vectorStorePath,
      new OpenAIEmbeddings({
        openAIApiKey: config.openAIApiKey,
      })
    )

    return new BrainUtil(store, config)
  }

  public async ask(input: IAskInput): Promise<string> {
    const data = await this.store.similaritySearch(input.prompt, 1)
    const context: string[] = []

    this.logger.debug(`[BrainUtil#ask] input: ${JSON.stringify(input, null, 2)}`)
    this.logger.debug(`[BrainUtil#ask] data: ${JSON.stringify(data, null, 2)}`)

    data.forEach(item => context.push(`Context:\n${item.pageContent}\}`))

    return this.llmChain.predict({
      prompt: input.prompt,
      context: context.join('\n'),
      history: input.history,
    })
  }
}
